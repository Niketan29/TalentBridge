import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getUnreadCountApi } from "../services/notificationApi";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const { clearSession, accessToken } = useAuth();

  const loadUnread = async () => {
    try {
      const res = await getUnreadCountApi(accessToken);
      setUnread(res.data.unread || 0);
    } catch {
      // ignore silently
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    loadUnread();

    // auto refresh every 10 sec
    const t = setInterval(loadUnread, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [accessToken]);

  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Overview" },
    { to: "/dashboard/jobs", label: "Jobs" },
    { to: "/dashboard/applications", label: "Applications" },
    { to: "/dashboard/resumes", label: "Resumes" },
    { to: "/dashboard/ats-checker", label: "ATS Checker" },
    { to: "/dashboard/notifications", label: "Notifications" },
    { to: "/dashboard/profile", label: "My Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b">
          <div className="font-extrabold text-lg">TalentBridge</div>
          <button
            className="lg:hidden px-3 py-1 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/dashboard"} // ✅ fix: only exact dashboard route should highlight
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 h-16 bg-white border-b">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold text-sm"
            >
              Menu
            </button>

            <div>
              <p className="text-xs text-slate-500">Dashboard</p>
              <p className="font-bold text-slate-900">TalentBridge</p>
            </div>

            <div className="flex items-center gap-3">
              {/* 🔔 Notifications */}
              <button
                onClick={() => navigate("/dashboard/notifications")}
                className="relative px-4 py-2 rounded-xl border hover:bg-slate-50 text-sm font-semibold"
                title="Notifications"
              >
                Notifications
                {unread > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-6 h-6 px-2 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </button>

              {/* Logout */}
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
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
