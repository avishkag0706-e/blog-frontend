// src/api.js
// A small helper around fetch(). Every request to the backend goes through
// request() so we never have to repeat the URL or the token header.

const API_URL = "http://localhost:5000";

// Reads the JWT that was saved at login time (null if not logged in)
export function getToken() {
  return localStorage.getItem("token");
}

// request("/api/posts", { method: "POST", body: { title, content } })
export async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };

  // Attach the token automatically when the user is logged in
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // The API sends JSON back; some DELETE responses may be empty
  const data = await response.json().catch(() => ({}));

  // Non-2xx status codes become an exception, so pages can show the message
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
