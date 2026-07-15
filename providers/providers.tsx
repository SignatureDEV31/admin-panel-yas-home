// app/providers.tsx
"use client";

import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/auth-context";
import { store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
