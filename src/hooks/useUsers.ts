import { useLocalStorage } from "./useLocalStorage";
import { User } from "@/types/user";

export function useUsers() {
  // Use local storage to persist users
  const [users, setUsers] = useLocalStorage<User[]>("users", []);

  // Add a new user
  const addUser = (user: User) => {
    // Prevent duplicate emails
    const updatedUsers = users.filter((u) => u.email !== user.email);
    updatedUsers.push(user);

    setUsers(updatedUsers);
  };

  // Get user by email
  const getUserByEmail = (email: string, password?: string): User | null => {
    const foundUser = users.find((u) => u.email === email);

    if (foundUser) {
      // If password is provided, verify it
      if (password && foundUser.password !== password) {
        return null;
      }

      return foundUser;
    }

    return null;
  };

  // Verify user credentials
  const verifyUser = (email: string, password: string): boolean => {
    return users.some((u) => u.email === email && u.password === password);
  };

  // Remove a user
  const removeUser = (email: string) => {
    const updatedUsers = users.filter((u) => u.email !== email);
    setUsers(updatedUsers);
  };

  return {
    users,
    addUser,
    getUserByEmail,
    verifyUser,
    removeUser,
  };
}
