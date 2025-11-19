// RTK Query API slice for fetching Star Wars characters
// Uses SWAPI (https://swapi.dev/) as the backend

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PeopleResponse } from "../types/PeopleResponse";

export const peopleApi = createApi({
  reducerPath: "peopleApi", // unique key for this slice in the Redux store
  baseQuery: fetchBaseQuery({ baseUrl: "https://swapi.dev/api/" }), // base URL for all requests
  endpoints: (builder) => ({
    //fetches a paginated list of people
    getPeople: builder.query<PeopleResponse, number>({
      query: (page) => `/people/?page=${page}`,
      keepUnusedDataFor: 300, // 5 minutes
    }),
  }),
});

export const { useGetPeopleQuery } = peopleApi;
