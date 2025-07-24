import { User } from "./types";

export function validateCredentials(
  storedUser: User | null,
  inputUser: User
): boolean {
  if (!storedUser) return false;
  return (
    storedUser.email === inputUser.email &&
    storedUser.password === inputUser.password
  );
}
