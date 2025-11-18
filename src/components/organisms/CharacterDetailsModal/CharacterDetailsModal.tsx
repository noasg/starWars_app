import Backdrop from "../../atoms/Backdrop/Backdrop";
import Modal from "../../molecules/Modal/Modal";
import type { Person } from "../../types/Person";
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
            <br />
          </div>
        </div>
      </Modal>
    </>
  );
}
