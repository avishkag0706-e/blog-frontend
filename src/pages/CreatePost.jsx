// src/pages/CreatePost.jsx
// Only logged-in users reach this page (App.jsx wraps it in <Protected>).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api.js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // The token is added automatically by api.js
      const post = await request("/api/posts", {
        method: "POST",
        body: { title, content },
      });
      navigate(`/posts/${post._id}`); // open the new post
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-box">
      <p className="eyebrow">New story</p>
      <h1>Create Post</h1>
      <p className="form-kicker">Share an idea, a guide or something you care about.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          placeholder="Give your post a catchy title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="post-content">Content</label>
        <textarea
          id="post-content"
          rows="12"
          placeholder="Start writing…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button className="btn" type="submit">Publish post</button>
      </form>
    </div>
  );
}
