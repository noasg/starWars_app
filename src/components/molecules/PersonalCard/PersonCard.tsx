import type { Person } from "../../types/Person";
import "./PersonCard.scss";

interface PersonCardProps {
  person: Person;
  onClick: (p: Person, img: string) => void;
}

export default function PersonCard({ person, onClick }: PersonCardProps) {
  const imageUrl = `https://picsum.photos/seed/${person.name}/150/150`;

  return (
    <div
      className="person-card"
      tabIndex={0}
      onClick={() => onClick(person, imageUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(person, imageUrl);
        }
      }}
    >
      <img
        src={imageUrl}
        alt={person.name}
        className="person-card__image"
        loading="lazy"
      />
      <div className="person-card__name">{person.name}</div>
    </div>
  );
}
