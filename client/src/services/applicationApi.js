import api from "./api";

export const applyJobApi = (accessToken, jobId) =>
  api.post(
    "/applications/apply",
    { jobId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const getMyApplicationsApi = (accessToken) =>
  api.get("/applications/my", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });


export const getApplicantsForJobApi = (accessToken, jobId) =>
  api.get(`/applications/job/${jobId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });


export const updateApplicationStatusApi = (accessToken, appId, status) =>
  api.put(
    `/applications/${appId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const getRecruiterApplicationsApi = (accessToken) =>
  api.get("/applications/recruiter", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
