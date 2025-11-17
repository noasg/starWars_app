import { useState, useEffect } from "react";
import { useGetPeopleQuery } from "../services/peopleApi";
import PeopleList from "../organisms/PeopleList/PeopleList";
import CharacterDetailsModal from "../organisms/CharacterDetailsModal/CharacterDetailsModal";
import type { Person } from "../types/Person";
import "./PeoplePage.scss";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../services/imageCacheSlice";
import type { RootState } from "../services/store"; // adjust path
import Pagination from "../molecules/Pagination/Pagination";
import LoaderSection from "../molecules/LoaderSection/LoaderSection";

export default function PeoplePage() {
  const [page, setPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, isLoading, isError, isFetching } = useGetPeopleQuery(page);

  const imageMap = useSelector((state: RootState) => state.imageCache);
  const dispatch = useDispatch();

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
      console.log("Caching images:", newImages);
      dispatch(setImages(newImages));
    }
  }, [data, imageMap, dispatch]);

  // Reset fetching-next flag when new data arrives
  useEffect(() => {
    if (!isFetching && isFetchingNext) {
      const timer = setTimeout(() => {
        setIsFetchingNext(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isFetching, isFetchingNext]);

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
        onCardClick={(person, img) => {
          console.log("Card clicked:", person.name);
          setSelectedPerson(person);
          setSelectedImage(img);
        }}
        disabled={selectedPerson !== null}
      />

      {selectedPerson && selectedImage && (
        <CharacterDetailsModal
          person={selectedPerson}
          image={selectedImage}
          onClose={() => setSelectedPerson(null)}
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
