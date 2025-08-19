export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function notEmpty(s: string) { return s.trim().length > 0; }
