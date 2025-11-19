import type { User } from "./authSlice";

//Key used in sessionStorage for persisted auth state
const KEY = "authState";

//Interface representing the structure of persisted authentication state
export interface PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

//Persist authentication state to sessionStorage
export function saveAuthState(state: PersistedAuth) {
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

// Load authentication state from sessionStorage
// Returns null if nothing is stored or parsing fails
export function loadAuthState(): PersistedAuth | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

// Clear authentication state from sessionStorage
// Typically called on logout
export function clearAuthState() {
  sessionStorage.removeItem(KEY);
}
