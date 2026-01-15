import api from "./api";

export const getAdminStatsApi = (accessToken) =>
    api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getAdminUsersApi = (accessToken, params = {}) =>
    api.get("/admin/users", {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const toggleBlockUserApi = (accessToken, userId) =>
    api.patch(
        `/admin/users/${userId}/toggle-block`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
