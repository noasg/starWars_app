import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PeopleResponse } from "../types/PeopleResponse";

export const peopleApi = createApi({
  reducerPath: "peopleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://swapi.dev/api/" }),
  endpoints: (builder) => ({
    getPeople: builder.query<PeopleResponse, number>({
      query: (page) => `/people/?page=${page}`,
      keepUnusedDataFor: 300, // 5 minutes
    }),
  }),
});

export const { useGetPeopleQuery } = peopleApi;
