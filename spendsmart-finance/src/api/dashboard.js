// src/api/dashboard.js
import { api } from './client';

export const dashboardApi = {
  // GET /dashboard?startDate=&endDate=
  get: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return api.get(`/dashboard${qs ? `?${qs}` : ''}`);
  },
};

// src/api/analytics.js
export const analyticsApi = {
  // GET /analytics/advanced?year=2024  (Pro users only)
  getAdvanced: (year) =>
    api.get(`/analytics/advanced${year ? `?year=${year}` : ''}`),
};

// src/api/export.js
export const exportApi = {
  // GET /export?format=json|csv&startDate=&endDate=
  download: async (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();

    const token = localStorage.getItem('ss-auth-token');
    const res   = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/export${qs ? `?${qs}` : ''}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Export failed');
    }

    // Trigger browser download
    const blob        = await res.blob();
    const disposition = res.headers.get('Content-Disposition') || '';
    const filename    = disposition.match(/filename="?(.+?)"?$/)?.[1]
      || `spendsmart-export.${params.format || 'json'}`;

    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
