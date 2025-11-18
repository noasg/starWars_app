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
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return result;
    }

    // ---- REFRESH ATTEMPT ----
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
      api.dispatch(
        loginSuccess({
          user: (api.getState() as RootState).auth.user!,
          accessToken: refreshResult.data.accessToken,
          refreshToken,
        })
      );

      // retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  return result;
};
