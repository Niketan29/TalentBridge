import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { getRecruiterJobsApi } from "../../services/jobApi";
import { Link } from "react-router-dom";

export default function RecruiterMyJobsPage() {
  const { accessToken } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getRecruiterJobsApi(accessToken);
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="bg-white border rounded-3xl p-6 sm:p-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Jobs</h1>
            <p className="text-slate-600 mt-1">Manage jobs you posted.</p>
          </div>

          <Link
            to="/recruiter/post-job"
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            + Post Job
          </Link>
        </div>

        <div className="bg-white border rounded-3xl p-6 sm:p-8">
          {loading && <p className="text-slate-600">Loading...</p>}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p className="text-slate-600">No jobs yet.</p>
          )}

          {!loading && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-extrabold text-slate-900">{job.title}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {job.companyName} • {job.location || "Remote"} •{" "}
                      {job.jobType}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-xs  font-bold px-3 py-2 border-2 rounded-full bg-slate-100 text-slate-900">
                      {job.status}
                    </span>
                    <Link
                      to={`/recruiter/job/${job._id}/applicants`}
                      className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
                    >
                      View Applicants
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
