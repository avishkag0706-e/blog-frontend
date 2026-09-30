// src/App.jsx
// Defines which page is shown for which URL.

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import { useAuth } from "./AuthContext.jsx";
import "./App.css";

// Blocks guests: if nobody is logged in we send them to /login.
// This is the frontend half of "protected routes".
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create" element={<Protected><CreatePost /></Protected>} />
          <Route path="/edit/:id" element={<Protected><EditPost /></Protected>} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">My Blog</span>
        <span className="footer-dot" />
        <span>Stories, ideas &amp; writing</span>
        <span className="footer-dot" />
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
