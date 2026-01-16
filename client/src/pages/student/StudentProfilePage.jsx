import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getStudentProfileApi,
  saveStudentProfileApi,
} from "../../services/profileApi";

export default function StudentProfilePage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    phone: "",
    headline: "",
    bio: "",
    skills: "",
    links: {
      github: "",
      linkedin: "",
      portfolio: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onLinkChange = (e) => {
    setForm((prev) => ({
      ...prev,
      links: { ...prev.links, [e.target.name]: e.target.value },
    }));
  };

  const loadProfile = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await getStudentProfileApi(accessToken);

      if (res.data.profile) {
        const p = res.data.profile;
        setForm({
          phone: p.phone || "",
          headline: p.headline || "",
          bio: p.bio || "",
          skills: (p.skills || []).join(", "),
          links: {
            github: p.links?.github || "",
            linkedin: p.links?.linkedin || "",
            portfolio: p.links?.portfolio || "",
          },
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
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

      const payload = {
        phone: form.phone,
        headline: form.headline,
        bio: form.bio,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        links: form.links,
      };

      const res = await saveStudentProfileApi(accessToken, payload);
      setMsg(res.data.message || "Saved ✅");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border p-6">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          My Profile
        </h1>
        <p className="text-slate-600 mt-1">
          Keep your profile updated to get better job matches.
        </p>
      </div>

      <form onSubmit={onSave} className="rounded-3xl bg-white border p-6 sm:p-8">
        {msg && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {msg}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="9999999999"
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Headline
            </label>
            <input
              name="headline"
              value={form.headline}
              onChange={onChange}
              placeholder="MERN Developer | React | Node"
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows={4}
              placeholder="Write a short bio..."
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Skills (comma separated)
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={onChange}
              placeholder="React, Node, MongoDB, Express"
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-extrabold text-slate-900">
            Links
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                GitHub
              </label>
              <input
                name="github"
                value={form.links.github}
                onChange={onLinkChange}
                placeholder="https://github.com/..."
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={form.links.linkedin}
                onChange={onLinkChange}
                placeholder="https://linkedin.com/in/..."
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Portfolio
              </label>
              <input
                name="portfolio"
                value={form.links.portfolio}
                onChange={onLinkChange}
                placeholder="https://your-portfolio.com"
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            disabled={saving}
            type="submit"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
