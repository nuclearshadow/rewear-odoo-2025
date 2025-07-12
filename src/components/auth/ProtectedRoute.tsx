'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          method: 'GET',
          credentials: 'include', // IMPORTANT: send HTTP-only cookie
        });

        if (res.ok) {
          const data = await res.json();
          setAuthenticated(true);
        } else {
          router.replace(redirectTo);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.replace(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  if (isLoading) return null;

  return <>{authenticated ? children : null}</>;
};

export default ProtectedRoute;
