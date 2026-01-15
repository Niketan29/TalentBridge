import api from "./api";

export const getJobsApi = () => api.get("/jobs");
export const getAllJobsApi = getJobsApi; 

export const getJobByIdApi = (id) => api.get(`/jobs/${id}`);

export const createJobApi = (accessToken, data) =>
  api.post("/jobs", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getRecruiterJobsApi = (accessToken) =>
  api.get("/jobs/recruiter/my-jobs", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
