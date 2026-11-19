import { STORAGE_KEYS } from '../utils/constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Centralized API Client for Skill Swap Network
 * Handles authentication headers, token expiration, error handling, and response unwrapping.
 */
export async function request(endpoint, { method = 'GET', data = null, headers = {} } = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  const requestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: requestHeaders,
  };

  if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.body = JSON.stringify(data);
  }

  // Construct absolute URL if endpoint doesn't start with http
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized / Expired Token
    if (response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // If user is currently in a protected section, redirect to login with query param
      const path = window.location.pathname;
      if (path.startsWith('/app') || path.startsWith('/admin')) {
        window.location.href = '/login?expired=true';
      }

      const err = new Error('Session expired or unauthorized. Please sign in again.');
      err.status = 401;
      throw err;
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      let message = json?.message || `HTTP ${response.status}: Request failed`;
      if (json?.errors && Array.isArray(json.errors) && json.errors.length > 0) {
        message = json.errors.join('; ');
      }
      const error = new Error(message);
      error.status = response.status;
      error.details = json?.errors || [];
      throw error;
    }

    // Backend returns standard ApiResponse envelope: { success: true, message, data, timestamp }
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data;
    }

    return json;
  } catch (err) {
    // If network connection failed (backend offline / connecting to mock fallback)
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn(`[API Client] Backend unreachable at ${url}.`, err);
    }
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options = {}) => request(endpoint, { method: 'POST', data, ...options }),
  put: (endpoint, data, options = {}) => request(endpoint, { method: 'PUT', data, ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
