export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  try {
    const resp = await fetch(input, init)
    const data = (await resp.json().catch(() => null)) as T | null

    if (!resp.ok || !data) {
      const anyData = data as any
      const message = anyData?.error || 'Network error. Please try again.'
      throw new Error(message)
    }

    return data
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection and try again.')
    }
    throw e
  }
}
