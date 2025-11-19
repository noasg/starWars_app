import type { Person } from "../types/Person";

function extractIdFromUrl(url: string): string {
  const match = url.match(/\/people\/(\d+)\//);
  return match ? match[1] : crypto.randomUUID();
}

const saveFavoriteToSession = (person: Person) => {
  const raw = sessionStorage.getItem("sessionFavourites");
  const parsed: Person[] = raw ? JSON.parse(raw) : [];

  // check duplicates by name
  const exists = parsed.some((p) => p.name === person.name);
  if (exists) return;

  // ensure ID exists
  const id = extractIdFromUrl(person.url);

  const withId = { ...person, id };

  parsed.push(withId);
  sessionStorage.setItem("sessionFavourites", JSON.stringify(parsed));
};
export default saveFavoriteToSession;
