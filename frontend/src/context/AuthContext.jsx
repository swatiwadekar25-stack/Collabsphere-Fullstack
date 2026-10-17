
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("collabsphere_demo_user"));
    } catch {
      return null;
    }
  });

  function login(email) {
    const demoUser = {
      name: email.split("@")[0] || "Developer",
      email,
    };

    localStorage.setItem(
      "collabsphere_demo_user",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);
  }

  function register(name, email) {
    const demoUser = { name, email };

    localStorage.setItem(
      "collabsphere_demo_user",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);
  }

  function logout() {
    localStorage.removeItem("collabsphere_demo_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
