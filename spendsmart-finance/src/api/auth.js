// src/api/auth.js
import { api } from './client';

export const authApi = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getMe: () =>
    api.get('/auth/me'),

  updateMe: (updates) =>
    api.put('/auth/me', updates),

  deleteMe: () =>
    api.delete('/auth/me'),
};
