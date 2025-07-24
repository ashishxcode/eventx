"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User, AuthState } from "./types";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) {
      return; // Prevent re-running if already checked
    }

    const checkSession = async () => {
      try {
        // Mark session check as started
        hasCheckedSession.current = true;

        // Check LocalStorage first
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!storedUser) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate session cookie
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (!response.ok) {
          console.warn("Session API request failed:", response.statusText);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        const { session } = await response.json();

        if (session && storedUser.email === session) {
          setUser(storedUser); // Reinforce user state
          setIsAuthenticated(true);
        } else {
          // Clear invalid session
          setUser(null);
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          setIsAuthenticated(false);
          router.replace("/auth/login");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router, setUser]);

  const login = async (newUser: User) => {
    try {
      // Set user in LocalStorage
      setUser(newUser);
      // Verify LocalStorage update
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser || storedUser.email !== newUser.email) {
        throw new Error("Failed to set user in LocalStorage");
      }
      // Set session cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: newUser.email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to set session cookie");
      }
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
