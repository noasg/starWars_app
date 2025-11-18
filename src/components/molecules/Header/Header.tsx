import { useState } from "react";
import "./Header.scss";
import LoginForm from "../LoginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authSlice";
import { peopleApi } from "../../services/peopleApi"; // or any other API slice you want to reset
import { authApi } from "../../services/authApi";
import type { RootState } from "../../services/store";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleLogout = () => {
    // Clear auth state
    dispatch(logout());

    // Reset all RTK Query API cache
    dispatch(peopleApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());

    // Optionally close login modal if open
    setShowLogin(false);
  };

  return (
    <header className="app-header">
      <h1>Star Wars App</h1>

      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => setShowLogin(true)}>Login</button>
      )}

      {!isAuthenticated && showLogin && (
        <div className="login-modal">
          <div className="login-modal__content">
            <button
              className="close-btn"
              onClick={() => setShowLogin(false)}
              aria-label="Close login form"
            >
              &times;
            </button>
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </header>
  );
}
