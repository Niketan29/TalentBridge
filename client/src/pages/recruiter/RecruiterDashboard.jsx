import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import { getRecruiterJobsApi } from "../../services/jobApi";
import { getRecruiterApplicationsApi } from "../../services/applicationApi";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-3xl p-6">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children, right }) {
  return (
    <div className="bg-white border rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {title}
          </h2>
          {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
        </div>
        {right}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsRes, appsRes] = await Promise.all([
        getRecruiterJobsApi(accessToken),
        getRecruiterApplicationsApi(accessToken),
      ]);

      setJobs(jobsRes?.data?.jobs || []);
      setApps(appsRes?.data?.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load recruiter data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    loadDashboard();
    // eslint-disable-next-line
  }, [accessToken]);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalApps = apps.length;

    const countBy = (status) =>
      apps.filter((a) => a.status?.toLowerCase() === status).length;

    return {
      totalJobs,
      totalApps,
      pending: countBy("applied"),
      shortlisted: countBy("shortlisted"),
      rejected: countBy("rejected"),
      hired: countBy("hired"),
    };
  }, [jobs, apps]);

  const recentJobs = useMemo(() => jobs.slice(0, 5), [jobs]);
  const recentApps = useMemo(() => apps.slice(0, 5), [apps]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-3xl p-6 sm:p-8">
        <p className="text-xs text-slate-500">Recruiter Dashboard</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-slate-600 mt-2">
          Manage job posts, review candidates, and track hiring progress.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="Jobs Posted" value={stats.totalJobs} />
        <StatCard label="Applications" value={stats.totalApps} />
        <StatCard label="Pending Review" value={stats.pending} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Rejected" value={stats.rejected} />
        <StatCard label="Hired" value={stats.hired} />
      </div>

      {/* Quick Actions */}
      <SectionCard
        title="Quick Actions"
        subtitle="Recruiter tools to speed up hiring."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="rounded-2xl border p-5 text-left hover:bg-slate-50 transition"
          >
            <p className="font-extrabold text-slate-900">Post New Job</p>
            <p className="text-sm text-slate-600 mt-1">
              Create a job post for freshers.
            </p>
          </button>

          <button
            onClick={() => navigate("/recruiter/my-jobs")}
            className="rounded-2xl border p-5 text-left hover:bg-slate-50 transition"
          >
            <p className="font-extrabold text-slate-900">My Jobs</p>
            <p className="text-sm text-slate-600 mt-1">
              View all posted jobs and applicants.
            </p>
          </button>

          
        </div>
      </SectionCard>

      {/* Recent Jobs */}
      <SectionCard
        title="Recent Job Posts"
        subtitle="Latest jobs posted by you."
        right={
          <button
            onClick={() => navigate("/recruiter/my-jobs")}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            View All →
          </button>
        }
      >
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : recentJobs.length === 0 ? (
          <p className="text-slate-600">
            You haven’t posted any jobs yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((j) => (
              <div
                key={j._id}
                className="rounded-2xl border p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-extrabold text-slate-900">{j.title}</p>
                  <p className="text-sm text-slate-600">
                    {j.companyName} • {j.location}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Recent Applications */}
      <SectionCard
        title="Recent Applications"
        subtitle="Latest candidates who applied to your jobs."
      >
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : recentApps.length === 0 ? (
          <p className="text-slate-600">
            No applications received yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentApps.map((a) => (
              <div
                key={a._id}
                className="rounded-2xl border p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-extrabold text-slate-900">
                    {a.studentId?.name || "Student"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Applied for: {a.jobId?.title || "Job"}
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
