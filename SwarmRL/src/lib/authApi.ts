export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const res = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
    credentials: 'include',
  });
  return parse<AuthResult>(res);
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
    credentials: 'include',
  });
  return parse<AuthResult>(res);
}

export async function logout(): Promise<{ ok: true }> {
  const res = await fetch('/api/v1/auth/logout', {
    method: 'POST',
    headers: JSON_HEADERS,
    credentials: 'include',
  });
  return parse<{ ok: true }>(res);
}

export async function fetchMe(): Promise<{ user: PublicUser }> {
  const res = await fetch('/api/v1/auth/me', {
    method: 'GET',
    credentials: 'include',
  });
  return parse<{ user: PublicUser }>(res);
}
