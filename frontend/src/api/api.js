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

    const isRefreshRequest =
      originalRequest.url === "/users/refresh-token";

    const isAuthRoute =
      originalRequest.url === "/users/login" ||
      originalRequest.url === "/users/register" ||
      originalRequest.url === "/users/verify-otp" ||
      originalRequest.url === "/users/resend-otp";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        await api.post(
          "/users/refresh-token"
        );

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);