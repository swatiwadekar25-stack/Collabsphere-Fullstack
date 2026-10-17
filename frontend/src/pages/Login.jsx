
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    login(email.trim());
    navigate("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link className="brand auth-brand" to="/">
          <span className="brand-mark">C</span>
          <span>Collab<span className="brand-accent">Sphere</span></span>
        </Link>
        <div className="auth-message">
          <span className="eyebrow">BUILD TOGETHER</span>
          <h1>Great ideas are built by great teams.</h1>
          <p>Projects, documentation and AI tools in one workspace.</p>
          <div className="auth-decoration">{"{ }"} &nbsp; {"< />"} &nbsp; ✦</div>
        </div>
      </section>

      <section className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to CollabSphere</h2>
          <p className="muted">Enter your details to access your workspace.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="primary-button full-width" type="submit">
            Sign in →
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>

          <p className="demo-notice">
            Demo mode: any non-empty email and password will sign you in.
          </p>
        </form>
      </section>
    </main>
  );
}
