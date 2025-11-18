import Backdrop from "../../atoms/Backdrop/Backdrop";
import Modal from "../../molecules/Modal/Modal";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { Person } from "../../types/Person";
import type { RootState } from "../../services/store";
import "./CharacterDetailsModal.scss";

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
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      // Redirect to login with next = current modal URL
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    // Logged in → perform favourite action
    console.log("Added to favourites:", person.name);
    // TODO: dispatch your add-to-favourites action here
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
            <div style={{ marginTop: "1rem" }}>
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
