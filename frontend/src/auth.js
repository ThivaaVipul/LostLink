import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_KEY = "authToken";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = () => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (err) {
    clearAuthToken();
    return null;
  }
};

export const isAuthenticated = () => Boolean(getCurrentUser());
