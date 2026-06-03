"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "recruiter" | "candidate";
}

// Helper function to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Decode payload (second part)
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    // Check if token is expired
    if (!decoded.exp) {
      console.warn("Token has no expiration field");
      return true;
    }

    const expirationMs = decoded.exp * 1000;
    const now = Date.now();
    const isExpired = expirationMs < now;

    console.log({
      expirationTime: new Date(expirationMs).toISOString(),
      currentTime: new Date(now).toISOString(),
      isExpired,
      remainingMs: expirationMs - now,
    });

    return isExpired;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { token, role, hydrated, logout } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!hydrated) {
      setIsLoading(true);
      return;
    }

    // Check if user is logged in
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/auth/login");
      setIsLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log("Token expired, clearing and redirecting to login");
      logout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/auth/login");
      setIsLoading(false);
      return;
    }

    // Check role if required
    if (requiredRole && role !== requiredRole) {
      console.log(`Role mismatch: expected ${requiredRole}, got ${role}`);
      router.push("/");
      setIsLoading(false);
      return;
    }

    // Authorization successful
    setIsAuthorized(true);
    setIsLoading(false);
  }, [token, role, hydrated, router, requiredRole, logout]);

  // Show loading while checking auth
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
