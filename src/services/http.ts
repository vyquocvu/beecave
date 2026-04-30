export interface HttpOptions extends RequestInit {
  timeoutMs?: number;
  json?: unknown;
}

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { timeoutMs = 15000, json, headers, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(headers as Record<string, string> | undefined),
      },
      body: json !== undefined ? JSON.stringify(json) : (rest as any).body,
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  } finally {
    clearTimeout(timer);
  }
}

export function postJson<T>(url: string, body: unknown, options: HttpOptions = {}) {
  return http<T>(url, { ...options, method: 'POST', json: body });
}

export function getJson<T>(url: string, options: HttpOptions = {}) {
  return http<T>(url, { ...options, method: 'GET' });
}
