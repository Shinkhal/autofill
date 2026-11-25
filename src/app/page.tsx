"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { decodeToken, User } from "@/services/authService";

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
          router.push("/home");
        } else {
          setUser(null);
          router.push("/welcome");
        }
      } else {
        setUser(null);
        router.push("/welcome");
      }
    };

    checkAuthStatus();

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, [router]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        const token = e.newValue;
        if (token) {
          const userData = decodeToken(token);
          if (userData) {
            setUser(userData);
            router.push("/dashboard");
          }
        } else {
          setUser(null);
          router.push("/welcome");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <div className="flex flex-col space-y-4 items-center">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-6 w-32 rounded-lg" />
          <div className="text-sm text-gray-500 mt-4">
            {user ? `Welcome back, ${user.name}!` : "Checking authentication..."}
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 items-center">
          <Skeleton className="h-20 w-60 rounded-lg" />
          <div className="text-sm text-gray-500">Redirecting...</div>
        </div>
      )}
    </div>
  );
}
