
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    register(name.trim(), email.trim());
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
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1>Create. Collaborate. Innovate.</h1>
          <p>Bring your ideas, team and AI-powered tools together.</p>
          <div className="auth-decoration">{"{ }"} &nbsp; {"< />"} &nbsp; ✦</div>
        </div>
      </section>

      <section className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="muted">Set up your developer workspace.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
          />

          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />

          <button className="primary-button full-width" type="submit">
            Create account →
          </button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>

          <p className="demo-notice">
            Demo only: account details are not sent to a server.
          </p>
        </form>
      </section>
    </main>
  );
}
