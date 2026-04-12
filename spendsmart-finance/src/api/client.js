// src/api/client.js
// Axios-free API client using the native Fetch API
// Token is read from localStorage on every call so it's always current.

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ── Core fetch wrapper ─────────────────────────────────────────────────
async function request(method, path, body = null, options = {}) {
  const token = localStorage.getItem('ss-auth-token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, config);

  // For blob/csv responses
  if (options.raw) return res;

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || `API error ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return data;
}

export const api = {
  get:    (path, opts)       => request('GET',    path, null, opts),
  post:   (path, body, opts) => request('POST',   path, body, opts),
  put:    (path, body, opts) => request('PUT',    path, body, opts),
  delete: (path, opts)       => request('DELETE', path, null, opts),
};
