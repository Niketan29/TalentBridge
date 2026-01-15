import api from "./api";

export const createResumeApi = (accessToken, data) =>
  api.post("/resumes", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getMyResumesApi = (accessToken) =>
  api.get("/resumes", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getResumeByIdApi = (accessToken, id) =>
  api.get(`/resumes/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const updateResumeApi = (accessToken, id, data) =>
  api.put(`/resumes/${id}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const deleteResumeApi = (accessToken, id) =>
  api.delete(`/resumes/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const setActiveResumeApi = (accessToken, id) =>
  api.put(`/resumes/${id}/active`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getActiveResumeApi = (accessToken) =>
  api.get("/resumes/active", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
