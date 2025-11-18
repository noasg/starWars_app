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
import { useParams, useNavigate } from "react-router-dom";

export default function PeoplePage() {
  const [page, setPage] = useState(1);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, isLoading, isError, isFetching } = useGetPeopleQuery(page);
  const imageMap = useSelector((state: RootState) => state.imageCache);
  const dispatch = useDispatch();

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Detect back/forward navigation
  useEffect(() => {
    console.log("URL changed, current modal person:", params.id ?? "none");
  }, [params.id]);

  // Cache images in Redux
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

  // Determine modal directly from URL
  const selectedPerson: Person | null = params.id
    ? (data?.results.find((p) => p.name === params.id) ?? null)
    : null;

  const selectedImage: string | null = selectedPerson
    ? `https://picsum.photos/seed/${selectedPerson.name}/150/150`
    : null;

  const handleCardClick = (person: Person) => {
    navigate(`/people/${person.name}`);
  };

  const handleModalClose = () => {
    navigate("/"); // closing modal just navigates back to main page
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
  if (isLoading || isFetchingNext) {
    return (
      <div className="people-page">
        <h1 className="people-page__title">Star Wars Characters</h1>
        <LoaderSection count={10} />
      </div>
    );
  }

  return (
    <div className="people-page">
      <h1 className="people-page__title">Star Wars Characters</h1>

      <PeopleList
        people={data?.results ?? []}
        imageMap={imageMap}
        onCardClick={handleCardClick}
        disabled={!!selectedPerson}
      />

      {selectedPerson && selectedImage && (
        <CharacterDetailsModal
          person={selectedPerson}
          image={selectedImage}
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
