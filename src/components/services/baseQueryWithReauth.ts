import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout, loginSuccess } from "./authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip Authorization for login endpoint
    if (endpoint === "login") return headers;

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
  // Skip refresh logic for login endpoint
  if (
    (typeof args !== "string" && "url" in args && args.url === "/auth/login") ||
    args === "/auth/login"
  ) {
    return rawBaseQuery(args, api, extraOptions);
  }

  // Normal request
  let result = await rawBaseQuery(args, api, extraOptions);

  // If 401, try refreshing token
  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = `/login?next=${encodeURIComponent(
        window.location.pathname
      )}`;
      return result;
    }

    // Refresh token request
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST", body: { refreshToken } },
      api,
      extraOptions
    );

    if (refreshResult.data?.accessToken) {
      // Update Redux with new access token
      api.dispatch(
        loginSuccess({
          user: state.auth.user!,
          accessToken: refreshResult.data.accessToken,
          refreshToken,
        })
      );

      // Retry original request with fresh token
      const retryArgs =
        typeof args === "string" ? args : { ...args, headers: undefined };
      result = await rawBaseQuery(retryArgs, api, extraOptions);
    } else {
      api.dispatch(logout());
      window.location.href = `/login?next=${encodeURIComponent(
        window.location.pathname
      )}`;
    }
  }

  return result;
};
