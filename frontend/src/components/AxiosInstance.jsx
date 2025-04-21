import axios from "axios";

const baseurl = "http://127.0.0.1:8000/";

const AxiosInstance = axios.create({
  baseURL: baseurl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Single response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors only for non-login routes
    if (error.response?.status === 401) {
      const isLoginRoute =
        error.config.url.includes("login") ||
        window.location.pathname.includes("/login");

      if (!isLoginRoute) {
        localStorage.removeItem("Token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
