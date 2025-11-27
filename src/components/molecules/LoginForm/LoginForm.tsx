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
  // ---- Local form state ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  // Tracks what fields were touched for validation highlights

  const emailRef = useRef<HTMLInputElement>(null); // Used to focus email field on errors

  // ---- Redux / Router hooks ----
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ⬅️ ADD THIS
  const [login, { isLoading }] = useLoginMutation();

  /**
   * -----------------------------------------------------------
   * Handle form submission
   * -----------------------------------------------------------
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic front-end validation
    // Only shows validation messages after fields were touched
    if (!email || !password) {
      setTouched({ email: true, password: true });
      return;
    }

    try {
      /**
       * Send login API request using RTK Query
       * .unwrap() converts rejectWithValue into a real error
       */
      const res = await login({ email, password }).unwrap();

      // Store credentials + user in Redux + sessionStorage
      dispatch(
        loginSuccess({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      /** -----------------------------------------------
       * If URL contains **?next=...** we redirect accordingly.
       * This is used for actions requiring login, e.g.:
       * /login?next=addFavourite:R2-D2
       *
       * After logging in → redirect to /people/R2-D2
       * ----------------------------------------------- */
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      if (next) {
        // Case: request to auto-open a person's modal
        if (next.startsWith("addFavourite:")) {
          const personId = next.replace("addFavourite:", "");
          navigate(`/people/${encodeURIComponent(personId)}`, {
            replace: true,
          });
          return;
        }
      }

      // Fallback: Parent component override
      if (onSuccess) onSuccess();
      else navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
      emailRef.current?.focus();
    }
  };

  /**
   * -----------------------------------------------------------
   * Render the login form
   * -----------------------------------------------------------
   */

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>

      {/* Email Field */}
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

      {/* Password Field */}
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

      {/* Backend or login errors */}
      {error && <div className="error-banner">{error}</div>}

      {/* Submit Button */}
      <PaginationButton>
        {isLoading ? "Logging in..." : "Login"}
      </PaginationButton>
    </form>
  );
}
