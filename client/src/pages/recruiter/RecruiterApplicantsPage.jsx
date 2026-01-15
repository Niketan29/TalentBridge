import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  getApplicantsForJobApi,
  updateApplicationStatusApi,
} from "../../services/applicationApi";

const badgeClass = (status) => {
  if (status === "shortlisted")
    return "bg-blue-50 border-blue-200 text-blue-700";
  if (status === "rejected") return "bg-red-50 border-red-200 text-red-700";
  if (status === "hired") return "bg-green-50 border-green-200 text-green-700";
  return "bg-slate-50 border-slate-200 text-slate-700";
};

export default function RecruiterApplicantsPage() {
  const { jobId } = useParams();
  const { accessToken } = useAuth();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);


  const load = async () => {
    if (!jobId) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getApplicantsForJobApi(accessToken, jobId);
      setApps(res.data.applicants || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      setUpdatingId(appId);
      await updateApplicationStatusApi(accessToken, appId, status);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (!jobId || !accessToken) return;
    load();
  }, [jobId, accessToken]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white border rounded-3xl p-6 sm:p-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Applicants
            </h1>
            <p className="text-slate-600 mt-1">
              Manage applicants for this job.
            </p>
          </div>

          <Link
            to="/recruiter/my-jobs"
            className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-white border rounded-3xl p-6 sm:p-8">
          {loading && <p className="text-slate-600">Loading applicants...</p>}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && apps.length === 0 && (
            <p className="text-slate-600">No applicants yet.</p>
          )}

          {!loading && apps.length > 0 && (
            <div className="space-y-3">
              {apps.map((a) => (
                <div
                  key={a._id}
                  className="border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div>
                    <p className="font-extrabold text-slate-900">
                      {a.studentId?.name || "Unknown Student"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {a.studentId?.email}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Applied: {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeClass(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </span>

                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="rounded-xl border px-4 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
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
