import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import { api } from "../api/api";
import {
  setUserCart,
} from "../redux/cartSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (
    userData,
    accessToken,
    refreshToken
  ) => {
    setUser(userData);

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken
      );
    }

    dispatch(
      setUserCart({
        userId: userData._id,
      })
    );
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      setUser(null);

      dispatch(
        setUserCart({
          userId: null,
        })
      );
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get(
          "/users/current-user"
        );

        const currentUser =
          response.data.data;

        setUser(currentUser);

        dispatch(
          setUserCart({
            userId: currentUser._id,
          })
        );
      } catch (error) {
        console.error(
          "Failed to fetch current user:",
          error
        );

        setUser(null);

        dispatch(
          setUserCart({
            userId: null,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [dispatch]);

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