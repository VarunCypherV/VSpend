import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";

  // List of public (unauthenticated) routes
  const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/register"];
  const isPublicRoute = PUBLIC_ROUTES.some((path) => url.startsWith(path));
  console.log(isPublicRoute, url);
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
