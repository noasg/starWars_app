import type { Person } from "./Person";

export interface PeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}
