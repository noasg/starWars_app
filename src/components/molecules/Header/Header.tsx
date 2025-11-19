import { useState, useEffect } from "react";
import "./Header.scss";
import LoginForm from "../LoginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authSlice";
import { peopleApi } from "../../services/peopleApi";
import { authApi } from "../../services/authApi";
import {
  // store,
  type RootState,
} from "../../services/store";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CloseButton from "../../atoms/CloseButton/CloseButton";
// import { protectedApi } from "../../services/protectedApi";

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
    sessionStorage.removeItem("sessionFavourites");

    dispatch(logout());
    dispatch(peopleApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());

    navigate("/", { replace: true });
  };

  const goToFavorites = () => {
    if (!isAuthenticated) {
      navigate("/?next=/favourites");
      return;
    }
    navigate("/favourites");
  };

  // const simulateProtectedCall = () => {
  //   store
  //     .dispatch(
  //       protectedApi.endpoints.getSecretData.initiate(undefined, {
  //         forceRefetch: true,
  //       })
  //     )
  //     .unwrap()
  //     .then((res) => console.log("Protected data result:", res))
  //     .catch((err) => console.error("Protected call failed:", err));
  // };

  return (
    <header className="app-header">
      {/* <PaginationButton
        onClick={simulateProtectedCall}
        style={{ marginTop: "0.5rem" }}
      >
        Simulate <br />
        Expired <br />
        Token
      </PaginationButton> */}

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
