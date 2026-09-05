import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

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

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(() => {
                        api(originalRequest)
                            .then(resolve)
                            .catch(reject);
                    });
                });
            }

            isRefreshing = true;

            try {
                await api.post("/users/refresh-token");

                isRefreshing = false;

                onRefreshed();

                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);