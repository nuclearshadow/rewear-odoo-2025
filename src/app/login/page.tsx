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
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
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

  // The redirection logic is perfect. It's centralized and reactive.
  useEffect(() => {
    if (!isAuthLoading && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, isAuthLoading, router]);

  // The login handler is also very well-written.
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
      setUser(userData); // Update state; useEffect handles navigation
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false); // Correctly re-enables the button on error
    }
  };

  // The loader logic is correct.
  if (isAuthLoading || user) {
    return <PageLoader />;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
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

        {/* --- THIS IS THE FIX --- */}
        {/* This container always reserves space, preventing layout shift on error. */}
        <div className="min-h-[72px]">
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fade-in"
              role="alert"
            >
              <p className="font-bold">Login Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
        {/* --- END OF FIX --- */}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="emailOrUsername"
              name="email"
              type="text"
              autoComplete="username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email or Username"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all active:scale-95"
            >
              {isSubmitting ? <ButtonSpinner /> : <LogIn size={20} />}
              <span>{isSubmitting ? "Logging In..." : "Login"}</span>
            </button>
          </div>
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
