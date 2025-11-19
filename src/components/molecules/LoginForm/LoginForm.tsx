// src/molecules/LoginForm/LoginForm.tsx
import { useState, useRef, type FormEvent } from "react";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../services/authSlice";
import { useNavigate } from "react-router-dom"; // ⬅️ ADD THIS
import "./LoginForm.scss";
import PaginationButton from "../../atoms/PaginationButton/PaginationButton";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const emailRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // ⬅️ ADD THIS
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setTouched({ email: true, password: true });
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      dispatch(
        loginSuccess({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      /** -----------------------------------------------
       * 🔥 NEW LOGIC: Handle the `next` query parameter
       * Example: ?next=addFavourite:R2-D2
       * ----------------------------------------------- */
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      if (next) {
        if (next.startsWith("addFavourite:")) {
          const personId = next.replace("addFavourite:", "");
          navigate(`/people/${encodeURIComponent(personId)}`, {
            replace: true,
          });
          return;
        }
      }

      // Default after login
      if (onSuccess) onSuccess();
      else navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
      emailRef.current?.focus();
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={!!(touched.email && !email)}
          aria-describedby="email-error"
        />
        {touched.email && !email && (
          <span id="email-error" className="error">
            Email is required
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          aria-invalid={!!(touched.password && !password)}
          aria-describedby="password-error"
        />
        {touched.password && !password && (
          <span id="password-error" className="error">
            Password is required
          </span>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <PaginationButton>
        {isLoading ? "Logging in..." : "Login"}
      </PaginationButton>
    </form>
  );
}
