// src/api/transactions.js
import { api } from './client';

export const transactionApi = {
  // GET /transactions?type=&category=&startDate=&endDate=&page=&limit=&sortBy=&order=
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return api.get(`/transactions${qs ? `?${qs}` : ''}`);
  },

  getById: (id) =>
    api.get(`/transactions/${id}`),

  create: (data) =>
    api.post('/transactions', data),

  update: (id, data) =>
    api.put(`/transactions/${id}`, data),

  remove: (id) =>
    api.delete(`/transactions/${id}`),
};
