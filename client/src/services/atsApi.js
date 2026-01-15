import api from "./api";

export const analyzeAtsApi = (accessToken, data) =>
  api.post("/ats/analyze", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
