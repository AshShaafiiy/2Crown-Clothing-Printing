// A centralized fetch client for the API.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiError extends Error {
  public status: number;
  public data: any;
  constructor(status: number, data: any, message?: string) {
    super(message || 'An error occurred during the API request');
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

let getAuthToken: () => string | null = () => null;

export const setTokenProvider = (provider: () => string | null) => {
  getAuthToken = provider;
};

export const apiClient = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return {} as T;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new ApiError(response.status, null, response.statusText);
    }
    return {} as T;
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || response.statusText;
    throw new ApiError(response.status, data, errorMsg);
  }

  return data as T;
};
