import PersonCard from "../../molecules/PersonalCard/PersonCard";
import type { Person } from "../../types/Person";
import "./PeopleList.scss";

export default function PeopleList({
  people,
  onCardClick,
  disabled,
}: {
  people: Person[];
  onCardClick: (p: Person, img: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="people-list">
      {people.map((person) => {
        // const imageUrl = `https://picsum.photos/seed/${person.name}/150/150`;
        return (
          <PersonCard
            key={person.name}
            person={person}
            onClick={onCardClick}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
