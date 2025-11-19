import { useState, useEffect } from "react";
import "./Header.scss";
import LoginForm from "../LoginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authSlice";
import { peopleApi } from "../../services/peopleApi";
import { authApi } from "../../services/authApi";
import type { RootState } from "../../services/store";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CloseButton from "../../atoms/CloseButton/CloseButton";
import type { Person } from "../../types/Person";

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

  const handleLoginSuccess = () => {
    setShowLogin(false);

    if (nextAfterLogin) {
      const [action, payload] = nextAfterLogin.split(":");

      if (action === "addFavourite" && payload) {
        // Add person to session favourites after login
        const raw = sessionStorage.getItem("sessionFavourites");
        let parsed: Person[] = [];

        try {
          parsed = raw ? JSON.parse(raw) : [];
        } catch {
          parsed = [];
        }

        const exists = parsed.some((p) => p.name === payload);
        if (!exists) {
          const uniqueId = `sess-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
          parsed.push({ name: payload, id: uniqueId } as Person);
          sessionStorage.setItem("sessionFavourites", JSON.stringify(parsed));
          console.log("Added session favourite after login:", payload);
        }
      }

      setNextAfterLogin(null);
    }

    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    sessionStorage.setItem("loggingOutFromProtected", "true");
    setShowLogin(false);
    sessionStorage.removeItem("sessionFavourites");
    dispatch(logout());
    dispatch(peopleApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    navigate("/", { replace: true });
    setTimeout(() => {
      sessionStorage.setItem("loggingOutFromProtected", "false");
    }, 100);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    console.log("Header useEffect - location:", next);
    if (next && !isAuthenticated) {
      Promise.resolve().then(() => {
        setNextAfterLogin(next);
        setShowLogin(true);
      });
    }
  }, [location.search, isAuthenticated, location.pathname]);

  const goToFavorites = () => {
    if (!isAuthenticated) {
      navigate("/?next=/favourites");
      return;
    }
    navigate("/favourites");
  };

  return (
    <header className="app-header">
      <h1 className="app-header__title">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Star Wars
        </Link>
      </h1>

      {isAuthenticated && userName && (
        <div className="app-header__center">
          <span className="welcome-msg">{userName}</span>
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
            <CloseButton
              onClick={() => setShowLogin(false)}
              ariaLabel="Close login form"
            />
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </header>
  );
}
