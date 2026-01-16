import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getRecruiterProfileApi,
  saveRecruiterProfileApi,
} from "../../services/profileApi";
import { useNavigate } from "react-router-dom";

export default function RecruiterProfilePage() {
  const navigate = useNavigate();
  const { accessToken, clearSession } = useAuth();

  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    companyLocation: "",
    aboutCompany: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const loadProfile = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await getRecruiterProfileApi(accessToken);

      if (res.data.profile) {
        const p = res.data.profile;
        setForm({
          companyName: p.companyName || "",
          companyWebsite: p.companyWebsite || "",
          companySize: p.companySize || "",
          companyLocation: p.companyLocation || "",
          aboutCompany: p.aboutCompany || "",
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      setSaving(true);
      const res = await saveRecruiterProfileApi(accessToken, form);
      setMsg(res.data.message || "Saved ✅");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save company profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-3xl bg-white border p-6">
          <p className="text-slate-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* topbar */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b">
        <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Recruiter</p>
            <p className="font-extrabold text-slate-900">Company Profile</p>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-white border p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Company Profile
          </h1>
          <p className="text-slate-600 mt-1">
            Complete your company profile to post jobs and hire faster.
          </p>

          {msg && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {msg}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSave} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Company Name
                </label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                  placeholder="TalentBridge Pvt Ltd"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Website
                </label>
                <input
                  name="companyWebsite"
                  value={form.companyWebsite}
                  onChange={onChange}
                  placeholder="https://company.com"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Company Size
                </label>
                <input
                  name="companySize"
                  value={form.companySize}
                  onChange={onChange}
                  placeholder="11-50"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Location
                </label>
                <input
                  name="companyLocation"
                  value={form.companyLocation}
                  onChange={onChange}
                  placeholder="Pune"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  About Company
                </label>
                <textarea
                  name="aboutCompany"
                  value={form.aboutCompany}
                  onChange={onChange}
                  rows={5}
                  placeholder="Write about your company..."
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={saving}
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Company Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
