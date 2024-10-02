export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  const re = /^.{8,}$/;
  return re.test(password);
}
