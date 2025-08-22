export const TOKEN_KEY = 'jwt_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Base64URL -> string */
function b64urlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
  return typeof window === 'undefined'
    ? Buffer.from(b64 + pad, 'base64').toString('utf8')
    : decodeURIComponent(
        atob(b64 + pad)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
}

export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(b64urlDecode(payload));
  } catch {
    return null;
  }
}

export function getTokenExpirationMs(token?: string): number {
  const t = token ?? getToken() ?? '';
  const payload = parseJwt<any>(t);
  const expSec = payload?.exp;
  return expSec ? expSec * 1000 : 0;
}

/** Treat as expired if within skewMs (default 5s) */
export function isTokenExpired(token?: string, skewMs = 5000): boolean {
  const expMs = getTokenExpirationMs(token);
  if (!expMs) return true;
  return Date.now() + skewMs >= expMs;
}

let logoutTimer: number | undefined;
let storageListenerAttached = false;

/**
 * Schedules an auto-logout at token expiry.
 * Returns a cleanup function that clears the timer.
 */
export function setupAutoLogout(onLogout?: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // Clear previous timer
  if (logoutTimer) {
    window.clearTimeout(logoutTimer);
    logoutTimer = undefined;
  }

  const token = getToken();
  if (!token) return () => {};

  const expMs = getTokenExpirationMs(token);
  const msLeft = expMs - Date.now();

  const doLogout = () => {
    clearToken();
    onLogout?.();
  };

  if (msLeft <= 0) {
    doLogout();
    return () => {};
  }

  logoutTimer = window.setTimeout(doLogout, msLeft);

  // Cross-tab sync (if user logs out or token removed elsewhere)
  if (!storageListenerAttached) {
    window.addEventListener('storage', (e) => {
      if (e.key === TOKEN_KEY && e.newValue === null) onLogout?.();
    });
    storageListenerAttached = true;
  }

  return () => {
    if (logoutTimer) window.clearTimeout(logoutTimer);
    logoutTimer = undefined;
  };
}

/** Ensures token is valid; logs out and calls onLogout if not. */
export function ensureValidOrLogout(onLogout?: () => void): boolean {
  if (isTokenExpired()) {
    clearToken();
    onLogout?.();
    return false;
  }
  return true;
}

export function isAuthed(): boolean {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}
