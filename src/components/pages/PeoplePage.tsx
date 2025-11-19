import { useState, useEffect } from "react";
import { useGetPeopleQuery } from "../services/peopleApi";
import PeopleList from "../organisms/PeopleList/PeopleList";
import CharacterDetailsModal from "../organisms/CharacterDetailsModal/CharacterDetailsModal";
import type { Person } from "../types/Person";
import "./PeoplePage.scss";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../services/imageCacheSlice";
import type { RootState } from "../services/store";
import Pagination from "../molecules/Pagination/Pagination";
import LoaderSection from "../molecules/LoaderSection/LoaderSection";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function PeoplePage() {
  const [page, setPage] = useState(1);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, isLoading, isError, isFetching } = useGetPeopleQuery(page);
  const imageMap = useSelector((state: RootState) => state.imageCache);
  const dispatch = useDispatch();

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Cache images
  useEffect(() => {
    if (!data) return;
    const newImages: Record<string, string> = {};
    data.results.forEach((person) => {
      if (!imageMap[person.name]) {
        newImages[person.name] =
          `https://picsum.photos/seed/${person.name}/150/150`;
      }
    });
    if (Object.keys(newImages).length > 0) {
      dispatch(setImages(newImages));
    }
  }, [data, imageMap, dispatch]);

  // Reset fetching-next flag
  useEffect(() => {
    if (!isFetching && isFetchingNext) {
      const timer = setTimeout(() => {
        setIsFetchingNext(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isFetching, isFetchingNext]);

  // Modal person determined by URL param
  const modalPerson: Person | null = params.id
    ? (data?.results.find((p) => p.name === params.id) ?? null)
    : null;

  const modalImage: string | null = modalPerson
    ? `https://picsum.photos/seed/${modalPerson.name}/150/150`
    : null;

  const handleCardClick = (person: Person) => {
    // Push modal URL but keep current page as background
    navigate(`/people/${person.name}`, { state: { background: location } });
  };

  const handleModalClose = () => {
    // Close modal → go back to background page if exists
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  const handleNext = () => {
    if (!data?.next || isFetchingNext) return;
    setIsFetchingNext(true);
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!data?.previous || isFetchingNext) return;
    setIsFetchingNext(true);
    setPage((prev) => prev - 1);
  };

  if (isError) return <div>Error loading people.</div>;
  if (isLoading) {
    return (
      <div className="people-page">
        <h1 className="people-page__title">Characters</h1>
        <LoaderSection count={10} />
      </div>
    );
  }

  return (
    <div className="people-page">
      <h1 className="people-page__title">Characters</h1>

      <PeopleList
        people={data?.results ?? []}
        imageMap={imageMap}
        onCardClick={handleCardClick}
        disabled={!!modalPerson}
      />

      {modalPerson && modalImage && (
        <CharacterDetailsModal
          person={modalPerson}
          image={modalImage}
          onClose={handleModalClose}
        />
      )}

      <Pagination
        onNext={handleNext}
        onPrev={handlePrev}
        isFetchingNext={isFetchingNext}
        hasNext={!!data?.next}
        hasPrev={!!data?.previous}
      />
    </div>
  );
}
