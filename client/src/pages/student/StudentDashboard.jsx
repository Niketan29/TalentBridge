import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import { getJobsApi } from "../../services/jobApi";
import { getMyApplicationsApi } from "../../services/applicationApi";
import { getNotificationsApi } from "../../services/notificationApi";

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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsRes, appsRes, notifRes] = await Promise.all([
        await getJobsApi(),
        getMyApplicationsApi(accessToken),
        getNotificationsApi(accessToken),
      ]);

      setJobs(jobsRes?.data?.jobs || []);
      setApps(appsRes?.data?.applications || []);
      setNotifications(notifRes?.data?.notifications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line
  }, []);

  const appStats = useMemo(() => {
    const total = apps.length;

    const countBy = (status) =>
      apps.filter((a) => a.status?.toLowerCase() === status).length;

    return {
      total,
      shortlisted: countBy("shortlisted"),
      rejected: countBy("rejected"),
      hired: countBy("hired"),
    };
  }, [apps]);

  const recentApps = useMemo(() => apps.slice(0, 5), [apps]);
  const recentNotifs = useMemo(() => notifications.slice(0, 3), [notifications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-3xl p-6 sm:p-8">
        <p className="text-xs text-slate-500">Student Dashboard</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-slate-600 mt-2">
          Track your applications, build ATS-friendly resumes, and apply faster.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Jobs Available" value={jobs.length} />
        <StatCard label="Applied" value={appStats.total} />
        <StatCard label="Shortlisted" value={appStats.shortlisted} />
        <StatCard label="Rejected" value={appStats.rejected} />
        <StatCard label="Hired" value={appStats.hired} />
      </div>

      {/* Quick Actions */}
      <SectionCard
        title="Quick Actions"
        subtitle="Jump directly to the most used features."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/dashboard/jobs")}
            className="rounded-2xl border p-5 text-left hover:bg-slate-50 transition"
          >
            <p className="font-extrabold text-slate-900">Browse Jobs</p>
            <p className="text-sm text-slate-600 mt-1">
              Find fresher jobs and apply quickly.
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/resumes")}
            className="rounded-2xl border p-5 text-left hover:bg-slate-50 transition"
          >
            <p className="font-extrabold text-slate-900">Build Resume</p>
            <p className="text-sm text-slate-600 mt-1">
              Create ATS-friendly resume templates.
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/ats-checker")}
            className="rounded-2xl border p-5 text-left hover:bg-slate-50 transition"
          >
            <p className="font-extrabold text-slate-900">ATS Checker</p>
            <p className="text-sm text-slate-600 mt-1">
              Compare your resume with a Job Description.
            </p>
          </button>
        </div>
      </SectionCard>

      {/* Recent Applications */}
      <SectionCard
        title="Recent Applications"
        subtitle="Your latest job applications."
        right={
          <button
            onClick={() => navigate("/dashboard/applications")}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            View All →
          </button>
        }
      >
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : recentApps.length === 0 ? (
          <p className="text-slate-600">
            You haven’t applied to any jobs yet.
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
                    {a.jobId?.title || "Job"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {a.jobId?.companyName} • {a.jobId?.location}
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

      {/* Notifications */}
      <SectionCard
        title="Latest Notifications"
        subtitle="Updates and activity from the platform."
        right={
          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
          >
            Open →
          </button>
        }
      >
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : recentNotifs.length === 0 ? (
          <p className="text-slate-600">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {recentNotifs.map((n) => (
              <div
                key={n._id}
                className={`rounded-2xl border p-4 ${
                  n.isRead ? "bg-white" : "bg-slate-50"
                }`}
              >
                <p className="font-extrabold text-slate-900">{n.title}</p>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
