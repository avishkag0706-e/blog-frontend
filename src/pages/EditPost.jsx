// src/pages/EditPost.jsx
// Loads the existing post, lets the author change it, then PUTs it back.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../api.js";

export default function EditPost() {
  const { id } = useParams();              // the post id from the URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fill the form with the current values when the page opens
  useEffect(() => {
    request(`/api/posts/${id}`)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await request(`/api/posts/${id}`, {
        method: "PUT",
        body: { title, content },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message); // e.g. "You can only edit your own posts"
    }
  }

  return (
    <div className="form-box">
      <p className="eyebrow">Editing</p>
      <h1>Edit Post</h1>
      <p className="form-kicker">Polish your wording — your changes save when you hit save.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="edit-content">Content</label>
        <textarea
          id="edit-content"
          rows="12"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button className="btn" type="submit">Save changes</button>
      </form>
    </div>
  );
}
