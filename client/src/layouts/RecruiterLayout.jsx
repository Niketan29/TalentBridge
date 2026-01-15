import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RecruiterLayout() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { clearSession } = useAuth();

  const links = [
    { to: "/recruiter", label: "Overview" },
    { to: "/recruiter/post-job", label: "Post Job" },
    { to: "/recruiter/my-jobs", label: "My Jobs" },
    { to: "/recruiter/profile", label: "Company Profile" },
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
              end={l.to === "/recruiter"}
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
              <p className="text-xs text-slate-500">Recruiter</p>
              <p className="font-bold text-slate-900">TalentBridge</p>
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

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
