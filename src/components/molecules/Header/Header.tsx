import { useState, useEffect } from "react";
import "./Header.scss";
import LoginForm from "../LoginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../../services/authSlice";
import { peopleApi } from "../../services/peopleApi";
import { authApi } from "../../services/authApi";
import { store, type RootState } from "../../services/store";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [nextAfterLogin, setNextAfterLogin] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  // Open login modal automatically if location has next query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");

    if (next && !isAuthenticated) {
      Promise.resolve().then(() => {
        setNextAfterLogin(next);
        setShowLogin(true);
      });
    }
  }, [location.search, isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    const redirectPath = nextAfterLogin || "/";
    setNextAfterLogin(null);
    navigate(redirectPath, { replace: true });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(peopleApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    navigate("/", { replace: true });
  };

  const goToFavorites = () => {
    if (!isAuthenticated) {
      navigate("/?next=/favourites"); // keep user on current page, modal opens automatically
      return;
    }
    navigate("/favourites");
  };

  const simulateExpiredToken = () => {
    store.dispatch(
      loginSuccess({
        user: { id: "1", name: "Luke Skywalker", email: "luke@starwars.com" },
        accessToken: "expired_token", // simulate expiry
        refreshToken: "mock_refresh_token", // valid refresh token
      })
    );
  };

  return (
    <header className="app-header">
      <h1 className="app-header__title">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Star Wars App
        </Link>
      </h1>

      <PaginationButton
        onClick={simulateExpiredToken}
        style={{ marginTop: "0.5rem" }}
      >
        Simulate Expired Token
      </PaginationButton>

      {isAuthenticated && userName && (
        <div className="app-header__center">
          <span className="welcome-msg">Welcome back, {userName}!</span>
          <PaginationButton onClick={goToFavorites}>Favorites</PaginationButton>
        </div>
      )}

      <div className="app-header__right">
        {isAuthenticated ? (
          <PaginationButton onClick={handleLogout}>Logout</PaginationButton>
        ) : (
          <PaginationButton onClick={() => setShowLogin(true)}>
            Login
          </PaginationButton>
        )}
      </div>

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
