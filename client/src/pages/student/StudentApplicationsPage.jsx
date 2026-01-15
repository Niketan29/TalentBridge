import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getMyApplicationsApi } from "../../services/applicationApi";

const statusColor = (status) => {
  if (status === "shortlisted") return "bg-blue-50 border-blue-200 text-blue-700";
  if (status === "rejected") return "bg-red-50 border-red-200 text-red-700";
  if (status === "hired") return "bg-green-50 border-green-200 text-green-700";
  return "bg-slate-50 border-slate-200 text-slate-700"; // applied
};

export default function StudentApplicationsPage() {
  const { accessToken } = useAuth();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMyApplicationsApi(accessToken);
      setApps(res.data.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Applications
        </h1>
        <p className="text-slate-600 mt-1">
          Track all your job applications and their status.
        </p>
      </div>

      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        {loading && <p className="text-slate-600">Loading...</p>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && apps.length === 0 && (
          <p className="text-slate-600">
            You have not applied to any jobs yet.
          </p>
        )}

        {!loading && apps.length > 0 && (
          <div className="space-y-3">
            {apps.map((a) => (
              <div
                key={a._id}
                className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">
                    {a.jobId?.title || "Job removed"}
                  </p>

                  <p className="text-sm text-slate-600">
                    {a.jobId?.companyName} • {a.jobId?.location || "Remote"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Applied on:{" "}
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>

                  {a.jobId?._id && (
                    <Link
                      to={`/dashboard/jobs/${a.jobId._id}`}
                      className="text-sm font-bold text-slate-900 hover:underline"
                    >
                      View Job →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
