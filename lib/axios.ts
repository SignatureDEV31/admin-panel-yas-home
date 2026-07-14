import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
  withCredentials: true,
});

// Helper to get token from various sources
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  // 1. Try direct "token" in localStorage (old method)
  let token = localStorage.getItem("token");
  if (token) return token;

  // 2. Try redux-persisted auth slice (new method)
  try {
    const persistedRoot = localStorage.getItem("persist:root");
    if (persistedRoot) {
      const rootState = JSON.parse(persistedRoot);
      if (rootState.auth) {
        const authState = JSON.parse(rootState.auth);
        if (authState.accessToken) {
          return authState.accessToken;
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse persisted auth state:", e);
  }

  return null;
};

// Check if we're in the browser
const isBrowser = typeof window !== "undefined";
// Only access localStorage in the browser
if (isBrowser) {
  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
} else {
  // Server-side: don't try to access localStorage
  api.interceptors.request.use((config) => {
    return config;
  });
}

export default api;
export { api };
