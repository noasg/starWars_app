import { useRef } from "react";
import type { Person } from "../../types/Person";
import "./PersonCard.scss";

interface PersonCardProps {
  person: Person;
  imageUrl: string;
  onClick: (p: Person, img: string) => void;
  disabled?: boolean;
}

export default function PersonCard({
  person,
  imageUrl,
  onClick,
  disabled,
}: PersonCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="person-card"
      role="button"
      tabIndex={disabled ? -1 : 0} // cannot be focused if disabled
      onClick={() => {
        if (disabled) return; // <-- skip if modal is open
        onClick(person, imageUrl);
      }}
      onKeyDown={(e) => {
        if (disabled) return; // <-- skip if modal is open
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(person, imageUrl);
        }
      }}
      onMouseEnter={() => !disabled && ref.current?.focus()} // only focus if not disabled
    >
      <img
        src={imageUrl ?? undefined}
        alt={person.name}
        className="person-card__image"
      />
      <div className="person-card__name">{person.name}</div>
    </div>
  );
}
