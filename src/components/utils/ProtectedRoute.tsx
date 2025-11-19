// A wrapper for routes that require authentication.
// If the user is not authenticated, it redirects them to the home page with a "next" query,
// so they can be redirected back after login.
// if i log out from "favourites" page, i check for loggingOutFromProtected to avoid redirect loop

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../services/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const location = useLocation();
  const loggingOutFromProtected = sessionStorage.getItem(
    "loggingOutFromProtected"
  );

  if (!isAuthenticated && !loggingOutFromProtected) {
    return (
      <Navigate
        to={`/?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
