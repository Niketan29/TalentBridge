import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { createJobApi } from "../../services/jobApi";

export default function RecruiterPostJobPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "fresher",
    salaryRange: "",
    skillsRequired: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      setSaving(true);

      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await createJobApi(accessToken, payload);
      setMsg(res.data.message || "Job created ✅");

      setTimeout(() => navigate("/recruiter/my-jobs"), 700);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white border rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Post a New Job
          </h1>
          <p className="text-slate-600 mt-1">
            Create a job post to start receiving applications.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white border rounded-3xl p-6 sm:p-8"
        >
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
              <label className="text-sm font-semibold text-slate-700">
                Job Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="MERN Developer (Fresher)"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Company Name
              </label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="TalentBridge Pvt Ltd"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Pune / Remote"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Salary Range
              </label>
              <input
                name="salaryRange"
                value={form.salaryRange}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="3 - 5 LPA"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Job Type
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Skills Required (comma separated)
              </label>
              <input
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="React, Node, MongoDB, Express"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Job Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={6}
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                placeholder="Describe job responsibilities..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/recruiter")}
              className="px-6 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
