"use client";

import React, { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { getUserByEmail, addUser } = useUsers();

  const [user, setUser] = useLocalStorage<User | null>("user", null);

  // Check authentication on initial load
  useEffect(() => {
    // If user exists in local storage, redirect to home/dashboard
    // If on login/signup page and authenticated, redirect to home
    if (user) {
      if (pathname === "/login" || pathname === "/signup") {
        router.push("/");
      }
    } else {
      // If no user and not on login/signup page, redirect to login
      if (pathname !== "/login" && pathname !== "/signup") {
        router.push("/login");
      }
    }
  }, [user, pathname, router]);

  const login = (email: string): boolean => {
    const foundUser = getUserByEmail(email);

    if (foundUser) {
      setUser(foundUser);
      router.push("/");
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    if (!email || !password || !name) {
      return false;
    }

    const existingUser = getUserByEmail(email);

    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(), // Use built-in UUID generation
      name,
      email,
      password: password, // In a real app, hash the password
      createdAt: new Date(),
    };

    // Add user to storage
    addUser(newUser);

    // Set current user
    setUser(newUser);

    // Redirect to home
    router.push("/");
    return true;
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedRoute(props = {}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};
