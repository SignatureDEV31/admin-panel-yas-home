"use client";

interface AuthLoadingScreenProps {
  message?: string;
}

export function LoadingScreen({
  message = "Loading your session...",
}: AuthLoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <div className="absolute font-bold text-primary text-xl">y</div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Yas Home
        </h2>

        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}