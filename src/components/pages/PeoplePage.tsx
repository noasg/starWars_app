// Displays a paginated list of Star Wars characters.
// Fetches data via RTK Query
// Caches images in Redux
// Shows skeleton loader while fetching

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
  // Current page for pagination
  const [page, setPage] = useState(1);
  // Flag indicating if we are fetching the next page
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, isLoading, isError, isFetching } = useGetPeopleQuery(page);

  // Cached images from Redux
  const imageMap = useSelector((state: RootState) => state.imageCache);
  const dispatch = useDispatch();

  // React Router hooks
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Cache images in Redux
  // Only generate new images for characters not already cached
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

  // Reset the fetching-next flag when data has finished fetching
  useEffect(() => {
    if (!isFetching && isFetchingNext) {
      const timer = setTimeout(() => {
        setIsFetchingNext(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isFetching, isFetchingNext]);

  // Determine the person to show in modal based on URL param
  const modalPerson: Person | null = params.id
    ? (data?.results.find((p) => p.name === params.id) ?? null)
    : null;

  const modalImage: string | null = modalPerson
    ? `https://picsum.photos/seed/${modalPerson.name}/150/150`
    : null;

  // When a card is clicked, open modal by updating URL with person's name
  const handleCardClick = (person: Person) => {
    navigate(`/people/${person.name}`, { state: { background: location } });
  };

  // Close modal
  // Navigate back to previous page if available, otherwise go to root
  const handleModalClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Pagination handlers
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

  // Handle loading and error states
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
