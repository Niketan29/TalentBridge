import api from "./api";

export const registerApi = (data) => api.post("/auth/register", data);

export const loginApi = (data) => api.post("/auth/login", data);

export const meApi = (accessToken) =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const refreshApi = () => api.post("/auth/refresh");

export const logoutApi = () => api.post("/auth/logout");
