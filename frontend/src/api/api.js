import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    const isRefreshRequest =
      url.includes("/users/refresh-token");

    const isAuthRoute =
      url.includes("/users/login") ||
      url.includes("/users/register") ||
      url.includes("/users/verify-otp") ||
      url.includes("/users/resend-otp");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh-token");

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);