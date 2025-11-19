import { useState } from "react";
import { useSelector } from "react-redux";
import PersonCard from "../molecules/PersonalCard/PersonCard";
import CharacterDetailsModal from "../organisms/CharacterDetailsModal/CharacterDetailsModal";
import type { Person } from "../types/Person";
import type { RootState } from "../services/store";
import "./FavouritesPage.scss";
export default function FavouritesPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  if (!user) {
    return <p>No user logged in.</p>;
  }

  const handleOpenModal = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => setSelectedPerson(null);

  const getImageUrl = (person: Person) =>
    `https://picsum.photos/seed/${encodeURIComponent(person.name)}/150/150`;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{user.name}'s Favorites</h2>

      {user.favorites && user.favorites.length === 0 && (
        <p>No favorites yet.</p>
      )}

      <div className="favorites-grid">
        {user.favorites?.map((person: Person) => (
          <PersonCard
            key={person.id}
            person={person}
            onClick={handleOpenModal}
            imageUrl={getImageUrl(person)}
          />
        ))}
      </div>

      {selectedPerson && (
        <CharacterDetailsModal
          person={selectedPerson}
          image={getImageUrl(selectedPerson)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
