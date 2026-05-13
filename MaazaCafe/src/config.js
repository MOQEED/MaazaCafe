const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:8000";
  const origin = window.location.origin;
  if (origin.includes("5173") || origin.includes("3000")) {
    return "http://localhost:8000";
  }
  return origin;
};

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || getDefaultApiUrl();
