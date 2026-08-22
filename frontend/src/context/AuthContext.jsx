import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import { api } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/users/current-user");

        setUser(response.data.data);
      } catch (error) {
        console.log("User is not authenticated.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};