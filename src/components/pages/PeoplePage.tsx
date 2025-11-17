import { useState, useEffect } from "react";
import { useGetPeopleQuery } from "../services/peopleApi";
import PeopleList from "../organisms/PeopleList/PeopleList";
import CharacterDetailsModal from "../organisms/CharacterDetailsModal/CharacterDetailsModal";
import PersonCardSkeleton from "../molecules/PersonCardSkeleton/PersonCardSkeleton";
import type { Person } from "../types/Person";
import "./PeoplePage.scss";

export default function PeoplePage() {
  const [page, setPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, isLoading, isError, isFetching } = useGetPeopleQuery(page);

  // Cache images per person
  useEffect(() => {
    if (!data) return;

    const newImages: Record<string, string> = {};
    data.results.forEach((person) => {
      if (!imageMap[person.name]) {
        newImages[person.name] =
          `https://picsum.photos/seed/${person.name}/300/300`;
      }
    });

    if (Object.keys(newImages).length > 0) {
      // defer state update to next tick
      const timer = setTimeout(() => {
        setImageMap((prev) => ({ ...prev, ...newImages }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

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

  // Show skeleton either on first load or while fetching next/prev
  if (isLoading || isFetchingNext) {
    return (
      <div className="people-page">
        <h1 className="people-page__title">Star Wars Characters</h1>
        <div className="people-list">
          {Array.from({ length: 10 }).map((_, i) => (
            <PersonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="people-page">
      <h1 className="people-page__title">Star Wars Characters</h1>

      <PeopleList
        people={data?.results ?? []}
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

      <div className="people-page__pagination">
        <button
          disabled={!data?.previous || isFetchingNext}
          onClick={handlePrev}
        >
          Prev
        </button>
        <button disabled={!data?.next || isFetchingNext} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
