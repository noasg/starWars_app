import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout, loginSuccess } from "./authSlice";

interface RefreshResponse {
  accessToken: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("[baseQuery] Starting request:", args);

  let result = await rawBaseQuery(args, api, extraOptions);
  console.log("[baseQuery] Initial result:", result);

  if (result.error?.status === 401) {
    console.warn("[baseQuery] 401 detected, attempting refresh...");

    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

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
      api.dispatch(
        loginSuccess({
          user: (api.getState() as RootState).auth.user!,
          accessToken: refreshResult.data.accessToken,
          refreshToken,
        })
      );

      console.log("[baseQuery] Retrying original request...");
      result = await rawBaseQuery(args, api, extraOptions);
      console.log("[baseQuery] Retried request result:", result);
    } else {
      console.error("[baseQuery] Refresh failed. Logging out.");
      api.dispatch(logout());
      window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  return result;
};
