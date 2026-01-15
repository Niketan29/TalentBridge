import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAdminStatsApi } from "../../services/adminApi";


const StatCard = ({ label, value }) => (
  <div className="border rounded-2xl p-5 bg-white">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
  </div>
);

const RolePill = ({ role, count }) => (
  <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50">
    {role}: {count}
  </span>
);

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { accessToken, clearSession, user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminStatsApi(accessToken);
      setStats(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b">
        <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Admin Panel</p>
            <p className="font-extrabold text-slate-900">
              {user?.email || "Admin"}
            </p>
          </div>

          <button
            onClick={async () => {
              await clearSession();
              navigate("/login");
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="bg-white border rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 mt-1">
            Monitor platform usage and growth.
          </p>
        </div>

        {loading && (
          <div className="bg-white border rounded-3xl p-6">
            <p className="text-slate-600">Loading stats...</p>
          </div>
        )}

        {error && (
          <div className="bg-white border rounded-3xl p-6">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} />
              <StatCard label="Total Jobs" value={stats.totalJobs} />
              <StatCard label="Applications" value={stats.totalApplications} />
              <StatCard label="Resumes" value={stats.totalResumes} />
            </div>

            <div className="bg-white border rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-extrabold text-slate-900">
                User Role Distribution
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {(stats.rolesCount || []).length === 0 ? (
                  <p className="text-slate-600 text-sm">No role data.</p>
                ) : (
                  stats.rolesCount.map((r) => (
                    <RolePill key={r._id} role={r._id} count={r.count} />
                  ))
                )}
              </div>
            </div>
          </>
        )}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Management
            </h2>
            <p className="text-slate-600 mt-1 text-sm">
              View all users and block/unblock accounts.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Manage Users →
          </Link>
        </div>
      </main>
    </div>
  );
}
