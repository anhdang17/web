interface FetchOptions extends RequestInit {
  cache?: RequestCache;
}

export async function api<T>(url: string, options?: FetchOptions): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Lỗi');
  return json.data as T;
}

// Parallel data fetching helper
export async function fetchParallel<T extends Record<string, unknown>>(
  fetches: { [K in keyof T]: () => Promise<T[K]> }
): Promise<T> {
  const keys = Object.keys(fetches) as (keyof T)[];
  const promises = keys.map((k) => fetches[k]());
  const results = await Promise.all(promises);
  return Object.fromEntries(keys.map((k, i) => [k, results[i]])) as T;
}
