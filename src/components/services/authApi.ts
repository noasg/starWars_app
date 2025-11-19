import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "./authSlice";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// Request body for login
interface LoginRequest {
  email: string;
  password: string;
}

//Response from login API
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

// authApi using Redux Toolkit Query
// Handles authentication-related endpoints:
// - login
// - refresh token
// - logout
// Uses a custom baseQueryWithReauth for automatic token refreshing.

export const authApi = createApi({
  reducerPath: "authApi", // Unique slice name in the Redux store
  baseQuery: baseQueryWithReauth, // Handles API requests and automatic refresh
  endpoints: (builder) => ({
    // Login mutation
    // Sends email/password to server, receives access/refresh tokens and user info
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),

    // Refresh token mutation
    // Sends refresh token to get a new access token

    refresh: builder.mutation<RefreshResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "auth/refresh",
        method: "POST",
        body,
      }),
    }),

    // Logout mutation
    // Invalidates server session / tokens
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;
