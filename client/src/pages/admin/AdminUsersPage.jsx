import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAdminUsersApi, toggleBlockUserApi } from "../../services/adminApi";

const Pill = ({ children, type = "default" }) => {
  const base = "text-xs font-bold px-3 py-1 rounded-full border";
  const map = {
    default: "bg-slate-50 border-slate-200 text-slate-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return <span className={`${base} ${map[type]}`}>{children}</span>;
};

export default function AdminUsersPage() {
  const { accessToken } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (role) params.role = role;
      if (search) params.search = search;

      const res = await getAdminUsersApi(accessToken, params);
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    const ok = confirm("Toggle block/unblock this user?");
    if (!ok) return;

    try {
      await toggleBlockUserApi(accessToken, id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update user status");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Admin</p>
            <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
            <p className="text-slate-600 mt-1">
              Manage users and block/unblock accounts.
            </p>
          </div>

          <Link
            to="/admin"
            className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
          >
            ← Back
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8">
          <h2 className="font-extrabold text-slate-900">Filters</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 md:col-span-2"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl border px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={load}
              className="rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 px-4 py-3"
            >
              Apply
            </button>

            <button
              onClick={() => {
                setSearch("");
                setRole("");
                setTimeout(load, 0);
              }}
              className="rounded-xl border text-sm font-semibold hover:bg-slate-50 px-4 py-3"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 overflow-x-auto">
          {loading && <p className="text-slate-600">Loading users...</p>}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="text-slate-600">No users found.</p>
          )}

          {!loading && users.length > 0 && (
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Created</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-b-0">
                    <td className="py-4 font-semibold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-4 text-slate-700">{u.email}</td>

                    <td className="py-4">
                      <Pill type={u.role === "admin" ? "blue" : "default"}>
                        {u.role}
                      </Pill>
                    </td>

                    <td className="py-4">
                      {u.isBlocked ? (
                        <Pill type="red">Blocked</Pill>
                      ) : (
                        <Pill type="green">Active</Pill>
                      )}
                    </td>

                    <td className="py-4 text-slate-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 text-right">
                      {u.role === "admin" ? (
                        <span className="text-xs font-bold text-slate-400">
                          No Action
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleBlock(u._id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                            u.isBlocked
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
