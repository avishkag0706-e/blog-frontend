// src/pages/Home.jsx
// Shows every blog post. Anyone can see this page.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

// Rough reading time from the word count.
function readTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

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

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Load all posts once when the page opens
  useEffect(() => {
    request("/api/posts")
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await request(`/api/posts/${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p._id !== id)); // remove it from the screen
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <header className="page-hero">
        <div>
          <p className="eyebrow">The Blog</p>
          <h1>All Posts</h1>
          <p className="lede">
            Stories, guides and ideas written by our community.
          </p>
        </div>

        {user && (
          <Link className="btn link-btn" to="/create">+ Write a post</Link>
        )}
      </header>

      {error && <p className="error">{error}</p>}

      {loading && (
        <div className="loading">
          <span className="spinner" aria-hidden="true" />
          Loading posts…
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">✍️</div>
          <h3>No posts yet</h3>
          <p>{user ? "Be the first — hit “Write a post” and share something." : "Check back soon for new stories."}</p>
        </div>
      )}

      {posts.map((post) => {
        // The author can be an object ({ _id, name }) after populate()
        const authorName = post.author ? post.author.name : "Unknown";
        const isOwner = user && post.author && post.author._id === user.id;

        return (
          <article className="card" key={post._id}>
            <h2><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>

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
              <span className="dot" />
              {readTime(post.content)} min read
            </p>

            <p className="preview">
              {post.content.slice(0, 180)}
              {post.content.length > 180 ? "…" : ""}
            </p>

            <div className="card-footer">
              <Link className="read-link" to={`/posts/${post._id}`}>
                Read article <span className="arrow" aria-hidden="true">→</span>
              </Link>

              {isOwner && (
                <span className="actions">
                  <Link className="btn btn-small btn-ghost" to={`/edit/${post._id}`}>Edit</Link>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(post._id)}>
                    Delete
                  </button>
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
