// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, KeyRound, LogIn } from "lucide-react";

const ButtonSpinner = () => (
  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const PageLoader = () => (
  <div className="min-h-[90vh] flex items-center justify-center bg-gray-100">
    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, setUser } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This useEffect is now the SINGLE source of truth for navigation.
  // It handles redirection both on initial load AND after handleLogin sets the user.
  useEffect(() => {
    if (!isAuthLoading && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, isAuthLoading, router]);

  // This is the corrected, simplified handleLogin function
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError("Email and password fields cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername, password, rememberMe }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to login.");

      const userData = { ...data.user, ...data.profile };
      // The function's only responsibility is to update state.
      // The useEffect above will handle the resulting navigation.
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false); // Important: Re-enable the button on error.
    }
  };

  // If we're checking auth OR if a user exists (and redirect is imminent), show loader.
  if (isAuthLoading || user) {
    return <PageLoader />;
  }

  // Otherwise, render the form.
  return (
    <div
      className="min-h-[90vh] w-full flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
      }}
    >
      <div
        className="w-full max-w-md p-8 space-y-6 
                     rounded-2xl border border-black/10 shadow-xl 
                     bg-white/80 backdrop-blur-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Login to continue to ReWear</p>
        </div>

        <div className="min-h-[72px]">
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
              role="alert"
            >
              <p className="font-bold">Login Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* The rest of your form JSX is perfect and doesn't need to change. */}
          <div className="relative">...</div>
          <div>...</div>
          <div>...</div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
