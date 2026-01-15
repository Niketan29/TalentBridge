import api from "./api";

export const getStudentProfileApi = (accessToken) =>
  api.get("/student/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const saveStudentProfileApi = (accessToken, data) =>
  api.put("/student/profile", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getRecruiterProfileApi = (accessToken) =>
  api.get("/recruiter/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const saveRecruiterProfileApi = (accessToken, data) =>
  api.put("/recruiter/profile", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
