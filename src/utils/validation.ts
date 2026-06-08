/**
 * Validates email format using basic regex pattern
 */
export function validateEmail(emailValue: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailValue);
}
