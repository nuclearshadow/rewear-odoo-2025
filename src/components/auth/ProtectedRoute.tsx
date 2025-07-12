"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
  tokenKey?: string; // cookie key, e.g. "user_token", "admin_token"
};

/**
 * ProtectedRoute
 *
 * A wrapper that checks for a token in cookies.
 * Redirects to login (or given path) if not present.
 *
 * @param children - protected content
 * @param redirectTo - fallback path if not authenticated
 * @param tokenKey - cookie key to check (default: "token")
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
  tokenKey = "token",
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const token = Cookies.get(tokenKey);

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.replace(redirectTo);
    }
  }, [token, redirectTo, router]);

  if (!isMounted || !token) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
