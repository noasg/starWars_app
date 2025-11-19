// services/protectedApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const protectedApi = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSecretData: builder.query<{ secret: string }, void>({
      query: () => "/protected/secret",
    }),
  }),
});

export const { useGetSecretDataQuery } = protectedApi;
