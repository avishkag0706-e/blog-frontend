// src/pages/Login.jsx
// Simple form: email + password -> POST /api/auth/login

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");
    try {
      await login(email, password); // saves token + user in AuthContext
      navigate("/");                // go to the home page
    } catch (err) {
      setError(err.message);        // e.g. "Invalid email or password"
    }
  }

  return (
    <div className="form-box">
      <p className="eyebrow">Welcome back</p>
      <h1>Login</h1>
      <p className="form-kicker">Sign in to write, edit and join the conversation.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">Login</button>
      </form>

      <p className="muted form-foot">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
