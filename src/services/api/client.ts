// A centralized fetch client for the API.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

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
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If endpoint already starts with /api, avoid doubling it
  const url = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `${API_BASE_URL}${cleanEndpoint}`;

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
      let textData = '';
      try {
        textData = await response.clone().text();
      } catch (e) { }
      
      let errorMsg = response.statusText;
      if (textData) {
        const titleMatch = textData.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          errorMsg = `HTTP ${response.status}: ${titleMatch[1]}`;
        } else {
          errorMsg = `HTTP ${response.status}: ${textData.substring(0, 100)}`;
        }
      } else if (!errorMsg) {
         errorMsg = `HTTP Error ${response.status}`;
      }
      throw new ApiError(response.status, null, errorMsg);
    }
    return {} as T;
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || response.statusText;
    throw new ApiError(response.status, data, errorMsg);
  }

  return data as T;
};
