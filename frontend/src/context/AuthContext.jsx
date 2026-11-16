
import { createContext, useContext, useState } from "react";
import { apiRequest } from "../services/api.js";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "collabsphere_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || { user: null, token: null };
    } catch {
      return { user: null, token: null };
    }
  });

  async function login(email, password) {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const nextAuth = { user: result.user, token: result.token };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return result;
  }

  async function register(name, email, password) {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    const nextAuth = { user: result.user, token: result.token };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return result;
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("collabsphere_demo_user");
    setAuth({ user: null, token: null });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
