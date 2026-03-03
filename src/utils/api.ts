/**
 * API base URL for backend requests
 * In development: uses Vite proxy (relative /api)
 * In production: uses the Render backend URL
 */

export const API_BASE_URL = import.meta.env.PROD
  ? 'https://brandit-4gcs.onrender.com'
  : ''

/**
 * Helper to build full API URL
 */
export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

/**
 * Fetch with timeout - prevents hanging on slow/cold server
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}
