import api from "./api";

export const getNotificationsApi = (accessToken) =>
  api.get("/notifications", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getUnreadCountApi = (accessToken) =>
  api.get("/notifications/unread-count", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const markNotificationReadApi = (accessToken, id) =>
  api.put(
    `/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
