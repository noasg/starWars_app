import PersonCard from "../../molecules/PersonalCard/PersonCard";
import type { Person } from "../../types/Person";
import "./PeopleList.scss";

export default function PeopleList({
  people,
  onCardClick,
}: {
  people: Person[];
  onCardClick: (p: Person, img: string) => void;
}) {
  return (
    <div className="people-list">
      {people.map((person) => (
        <PersonCard key={person.name} person={person} onClick={onCardClick} />
      ))}
    </div>
  );
}
