import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { clearSession, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="bg-white border rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">Admin Dashboard ✅</h1>
          <p className="text-slate-600 text-sm mt-1">{user?.email}</p>
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
    </div>
  );
}
