// src/pages/Register.jsx
// Simple form: name + email + password -> POST /api/auth/register

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password); // create account + log in
      navigate("/");
    } catch (err) {
      setError(err.message); // e.g. "Email already registered"
    }
  }

  return (
    <div className="form-box">
      <p className="eyebrow">Join us</p>
      <h1>Register</h1>
      <p className="form-kicker">Create a free account and start publishing in seconds.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="reg-name">Name</label>
        <input
          id="reg-name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">Create account</button>
      </form>

      <p className="muted form-foot">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
