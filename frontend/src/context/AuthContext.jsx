import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import { api } from "../api/api";

import { setUserCart } from "../redux/cartSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get(
          "/users/current-user"
        );

        const currentUser = response.data.data;

        setUser(currentUser);

        dispatch(
          setUserCart({
            userId: currentUser._id,
          })
        );
      } catch (error) {
        console.log("User is not authenticated.");

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

  const login = (userData) => {
    setUser(userData);

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
      console.error("Logout failed:", error);
    } finally {
      setUser(null);

      dispatch(
        setUserCart({
          userId: null,
        })
      );
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