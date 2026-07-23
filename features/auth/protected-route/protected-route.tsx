// components/protected-route.tsx
"use client";

import { useAuth } from "@/contexts/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            width: 48px;
            height: 48px;
            display: inline-block;
            position: relative;
          }
          .loader::after,
          .loader::before {
            content: "";
            width: 48px;
            height: 48px;
            border: 2px solid #9ca3af;
            position: absolute;
            left: 0;
            top: 0;
            box-sizing: border-box;
            animation: rotation 2s ease-in-out infinite;
          }
          .loader::after {
            border-color: var(--main);
            animation-delay: 1s;
          }

          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
