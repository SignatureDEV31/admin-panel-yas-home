import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
  withCredentials: true,
});

// Check if we're in the browser
const isBrowser = typeof window !== "undefined";
// Only access localStorage in the browser
if (isBrowser) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
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
