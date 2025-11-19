import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout, loginSuccess } from "./authSlice";

//Response structure expected from the refresh token endpoint
interface RefreshResponse {
  accessToken: string;
}

//Base query without reauth
// Sets Authorization header if access token exists
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

//Base query with automatic reauthentication on 401 responses
// If a 401 is encountered, attempts to refresh the access token using the refresh token
// If refresh is successful, retries the original request
//  If refresh fails, logs out the user and redirects to home with "next" query
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("[baseQuery] Starting request:", args);

  // Perform the original request
  let result = await rawBaseQuery(args, api, extraOptions);
  console.log("[baseQuery] Initial result:", result);

  // If 401 Unauthorized, attempt refresh
  if (result.error?.status === 401) {
    console.warn("[baseQuery] 401 detected, attempting refresh...");

    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    // No refresh token → log out immediately
    if (!refreshToken) {
      console.error("[baseQuery] No refresh token found. Logging out.");
      api.dispatch(logout());
      window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
      return result;
    }

    console.log(
      "[baseQuery] Sending refresh request with token:",
      refreshToken
    );

    // Attempt refresh token request
    const refreshResult = (await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    )) as { data?: RefreshResponse; error?: FetchBaseQueryError };

    if (refreshResult.data?.accessToken) {
      console.log(
        "[baseQuery] Refresh successful! New access token:",
        refreshResult.data.accessToken
      );

      // Update state with new access token
      api.dispatch(
        loginSuccess({
          user: (api.getState() as RootState).auth.user!,
          accessToken: refreshResult.data.accessToken,
          refreshToken,
        })
      );

      // Retry the original request with new access token
      console.log("[baseQuery] Retrying original request...");
      result = await rawBaseQuery(args, api, extraOptions);
      console.log("[baseQuery] Retried request result:", result);
    } else {
      // Refresh failed → log out
      console.error("[baseQuery] Refresh failed. Logging out.");
      api.dispatch(logout());
      window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  return result;
};
