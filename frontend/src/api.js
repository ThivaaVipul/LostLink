import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./config";
import { clearAuthToken, getAuthToken } from "./auth";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isAuthRequest = requestUrl.includes("/api/auth/");

    if (status === 401 && !isAuthRequest && !error.config?.skipAuthRedirect) {
      clearAuthToken();
      toast.error("Your session expired. Please log in again.", {
        autoClose: 3000,
        theme: "light",
      });

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
