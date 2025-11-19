// Displays a user's favorite characters.
// Combines server-side favorites (from user object) and sessionStorage favorites (temporary, local).
// Allows opening a modal with character details by clicking on a card.

import { useState } from "react";
import { useSelector } from "react-redux";
import PersonCard from "../molecules/PersonalCard/PersonCard";
import CharacterDetailsModal from "../organisms/CharacterDetailsModal/CharacterDetailsModal";
import type { Person } from "../types/Person";
import type { RootState } from "../services/store";
import "./FavouritesPage.scss";

export default function FavouritesPage() {
  // Get the logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  // State for the currently selected character to show in modal
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  if (!user) return <p>No user logged in.</p>;

  const handleOpenModal = (person: Person) => setSelectedPerson(person);
  const handleCloseModal = () => setSelectedPerson(null);

  const getImageUrl = (person: Person) =>
    `https://picsum.photos/seed/${encodeURIComponent(person.name)}/150/150`;

  const raw = sessionStorage.getItem("sessionFavourites");
  let parsedSessionFavourites: Person[] = [];

  try {
    parsedSessionFavourites = raw ? JSON.parse(raw) : [];
  } catch {
    parsedSessionFavourites = [];
  }

  // Merge favorites:
  // Start with the user's saved favorites from the dummy object
  // Add sessionStorage favorites that are not already in user's favorites

  const mergedFavourites: Person[] = [
    ...user.favorites,
    ...parsedSessionFavourites.filter(
      (sessionItem) =>
        !user.favorites.some((fav) => fav.name === sessionItem.name)
    ),
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{user.name}'s Favorites</h2>

      {mergedFavourites.length === 0 && <p>No favorites yet.</p>}

      <div className="favorites-grid">
        {mergedFavourites.map((person) => (
          <PersonCard
            key={person.id ?? person.url ?? person.name}
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
