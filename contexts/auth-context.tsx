// contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/axios";
import { setUser, clearUser } from "@/store/auth/user-slice";

type User = {
  _id?: string;
  fullName: string;
  email: string;
  image?: string | null;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const refreshUser = useCallback(async () => {
    try {
      // Check both localStorage and sessionStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setUserState(null);
        dispatch(clearUser());
        return;
      }

      // Set token in axios headers
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Get current user
      const response = await api.get("/authentication/whoami");
      const userData = response.data.user;

      setUserState(userData);
      dispatch(setUser(userData));
    } catch (error) {
      console.error("Failed to refresh user:", error);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUserState(null);
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    delete api.defaults.headers["Authorization"];
    setUserState(null);
    dispatch(clearUser());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
