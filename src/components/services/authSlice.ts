import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { saveAuthState, clearAuthState, loadAuthState } from "./authStorage";
import type { Person } from "../types/Person";

//User interface
export interface User {
  id: string;
  name: string;
  email: string;
  favorites: Person[];
}

// Auth state interface
// Stores access/refresh tokens, user info, and authentication status
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Load persisted auth state from sessionStorage (if available)
const stored = loadAuthState();

//  Initial auth state
// If nothing is stored in sessionStorage, use default unauthenticated state

const initialState: AuthState = stored ?? {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

// Redux slice for authentication
// Handles login, logout, and state persistence
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Called when login is successful
    // Stores tokens, user info, sets isAuthenticated to true
    // Persists state to sessionStorage
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // persist to sessionStorage
      saveAuthState(state);
    },

    // Clears all authentication info from state and sessionStorage
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      clearAuthState();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
