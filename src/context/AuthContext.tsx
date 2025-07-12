// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of your User object based on your database table
// This should match the object you return from your API
type User = {
  id: string;
  email: string;
  username: string;
  points_balance: number;
  role: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean; // To know when we are checking the session
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs once when the app loads
  useEffect(() => {
    async function checkUserSession() {
      try {
        // Call the new `/me` endpoint to see if a session exists
        const response = await fetch("/api/v1/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Set the user in global state
        } else {
          setUser(null); // No valid session
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
        setUser(null);
      } finally {
        setIsLoading(false); // We're done checking
      }
    }
    checkUserSession();
  }, []); // The empty array [] means this runs only once on mount

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
