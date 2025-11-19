import Backdrop from "../../atoms/Backdrop/Backdrop";
import Modal from "../../molecules/Modal/Modal";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Person } from "../../types/Person";
import type { RootState } from "../../services/store";
import "./CharacterDetailsModal.scss";
import saveFavoriteToSession from "../../utils/saveFavouriteToSession ";

export default function CharacterDetailsModal({
  person,
  image,
  onClose,
}: {
  person: Person;
  image: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      const nextAction = `addFavourite:${person.name}`;
      navigate(`/?next=${encodeURIComponent(nextAction)}`);
      return;
    }

    const raw = sessionStorage.getItem("sessionFavourites");
    let parsed: Person[] = [];

    try {
      parsed = raw ? JSON.parse(raw) : [];
    } catch {
      parsed = [];
    }

    // Check duplicate by name
    const exists = parsed.some((p) => p.name === person.name);
    if (exists) return;

    // Assign guaranteed unique ID
    const uniqueId = `sess-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

    const newPerson: Person = {
      ...person,
      id: uniqueId,
    };

    parsed.push(newPerson);
    sessionStorage.setItem("sessionFavourites", JSON.stringify(parsed));

    console.log("Added session favourite:", newPerson);
  };

  return (
    <>
      <Backdrop onClick={onClose} />

      <Modal onClose={onClose}>
        <div className="character-modal">
          {/* Header section */}
          <header className="character-modal__header">
            <h2 className="character-modal__title">{person.name}</h2>
          </header>

          {/* Image */}
          <img
            src={image}
            alt={person.name}
            className="character-modal__image"
          />

          {/* Details */}
          <div className="character-modal__content">
            <p>
              <strong>Height:</strong> {Number(person.height) / 100} m
            </p>
            <p>
              <strong>Mass:</strong> {person.mass} kg
            </p>
            <p>
              <strong>Birth Year:</strong> {person.birth_year}
            </p>
            <p>
              <strong>Films:</strong> {person.films.length}
            </p>
            <p>
              <strong>Added to API:</strong>{" "}
              {new Date(person.created).toLocaleDateString("en-GB")}
            </p>

            {/* Add to favourites button */}
            <div style={{ marginBottom: "1rem" }}>
              <PaginationButton onClick={handleAddToFavorites}>
                Add to favourites
              </PaginationButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
