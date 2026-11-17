import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // console.log("USER IN MAIN LAYOUT:", user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.data));
    setUser(data.data);

    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user,setUser , loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  }
  return context;
}