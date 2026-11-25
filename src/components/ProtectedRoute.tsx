"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/welcome",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if unauthenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [loading, user, redirectTo, router]);

  // Memoized auth check (improves readability)
  const isAuthResolved = useMemo(() => !loading && !!user, [loading, user]);

  // Show loader while checking
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flicker if user is not authenticated
  if (!isAuthResolved) return null;

  return <>{children}</>;
}
