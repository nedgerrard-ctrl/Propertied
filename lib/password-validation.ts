export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";

export function isValidPassword(password: string): boolean {
  if (typeof password !== "string") return false;

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  return (
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialCharacter
  );
}