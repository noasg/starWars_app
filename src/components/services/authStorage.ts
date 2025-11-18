import type { User } from "./authSlice";

const KEY = "authState";

export interface PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export function saveAuthState(state: PersistedAuth) {
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

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

export function clearAuthState() {
  sessionStorage.removeItem(KEY);
}
