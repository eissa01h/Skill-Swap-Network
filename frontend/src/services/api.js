import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Standard REST API Request Client
 */
export async function apiRequest(endpoint, { method = 'GET', data = null, headers = {} } = {}) {
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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = result?.message || `HTTP ${response.status}: Request failed`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = result?.errors || [];
      throw error;
    }

    return result;
  } catch (err) {
    throw err;
  }
}
