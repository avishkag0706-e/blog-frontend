// src/AuthContext.jsx
// Keeps the logged-in user in one place so every page can reach it
// without passing props through the whole tree (this is React Context).

import { createContext, useContext, useState } from "react";
import { request } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start from whatever was saved in the browser, so a page refresh
  // does not log the user out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Save token + user after a successful register/login
  function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    saveSession(data);
  }

  async function login(email, password) {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveSession(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Short-cut so pages can write:  const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
