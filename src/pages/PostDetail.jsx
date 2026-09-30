// src/pages/PostDetail.jsx
// One blog post + all of its comments.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

// First letters of a name, for the author avatar.
function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function PostDetail() {
  const { id } = useParams();          // post id from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load the post and its comments once
  useEffect(() => {
    request(`/api/posts/${id}`).then(setPost).catch((err) => setError(err.message));
    request(`/api/posts/${id}/comments`).then(setComments).catch(() => {});
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!post) {
    return (
      <div className="loading">
        <span className="spinner" aria-hidden="true" />
        Loading post…
      </div>
    );
  }

  const authorName = post.author ? post.author.name : "Unknown";
  const isOwner = user && post.author && post.author._id === user.id;

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");
    try {
      const comment = await request(`/api/posts/${id}/comments`, {
        method: "POST",
        body: { content: text },
      });
      setComments([...comments, comment]); // show it right away
      setText("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await request(`/api/comments/${commentId}`, { method: "DELETE" });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeletePost() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await request(`/api/posts/${id}`, { method: "DELETE" });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <article className="card">
        <p className="eyebrow">Article</p>
        <h1>{post.title}</h1>

        <p className="meta">
          <span className="avatar avatar-sm" aria-hidden="true">
            {initials(authorName)}
          </span>
          <strong>{authorName}</strong>
          <span className="dot" />
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <p className="post-content">{post.content}</p>

        {isOwner && (
          <div className="actions">
            <Link className="btn btn-small btn-ghost" to={`/edit/${post._id}`}>Edit</Link>
            <button className="btn btn-small btn-danger" onClick={handleDeletePost}>Delete</button>
          </div>
        )}
      </article>

      <section className="comments">
        <h2>Comments <span className="badge">{comments.length}</span></h2>

        {comments.length === 0 && (
          <div className="empty-state" style={{ padding: "34px 20px" }}>
            <div className="empty-icon" aria-hidden="true">💬</div>
            <h3>No comments yet</h3>
            <p>{user ? "Start the conversation below." : "Login to leave the first comment."}</p>
          </div>
        )}

        {comments.map((c) => {
          const commenter = c.author ? c.author.name : "Unknown";
          return (
            <div className="comment" key={c._id}>
              <span className="avatar avatar-sm" aria-hidden="true">
                {initials(commenter)}
              </span>

              <div className="comment-main">
                <p className="meta">
                  <strong>{commenter}</strong>
                  <span className="dot" />
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>{c.content}</p>
                {user && c.author && c.author._id === user.id && (
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <label htmlFor="comment-box">Leave a comment</label>
            <textarea
              id="comment-box"
              rows="3"
              placeholder="Write a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button className="btn" type="submit">Add comment</button>
          </form>
        ) : (
          <p className="muted" style={{ marginBottom: 0 }}>
            <Link to="/login">Login</Link> to leave a comment.
          </p>
        )}
      </section>
    </div>
  );
}
