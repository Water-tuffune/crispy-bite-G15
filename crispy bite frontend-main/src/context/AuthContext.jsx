import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("crispybite_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("crispybite_token");
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // AuthContext keeps login state available to every page without prop drilling.
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("crispybite_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    localStorage.setItem("crispybite_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("crispybite_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
