import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getResumeByIdApi, updateResumeApi } from "../../services/resumeApi";

const emptyEducation = {
  degree: "",
  institute: "",
  startYear: "",
  endYear: "",
};
const emptyProject = { title: "", description: "", techStack: [], link: "" };
const emptyExp = {
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function ResumeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getResumeByIdApi(accessToken, id);
      setResume(res.data.resume);
      setSkillsText((res.data.resume.skills || []).join(", "));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const updateField = (path, value) => {
    // path example: "personal.fullName" or "summary"
    setResume((prev) => {
      const copy = structuredClone(prev);
      const parts = path.split(".");
      let ref = copy;
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const addItem = (key) => {
    setResume((prev) => {
      const copy = structuredClone(prev);
      if (key === "education") copy.education.push({ ...emptyEducation });
      if (key === "projects") copy.projects.push({ ...emptyProject });
      if (key === "experience") copy.experience.push({ ...emptyExp });
      return copy;
    });
  };

  const removeItem = (key, index) => {
    setResume((prev) => {
      const copy = structuredClone(prev);
      copy[key].splice(index, 1);
      return copy;
    });
  };

  const updateArrayItem = (key, index, field, value) => {
    setResume((prev) => {
      const copy = structuredClone(prev);
      copy[key][index][field] = value;
      return copy;
    });
  };

  const save = async () => {
    try {
      setSaving(true);
      setMsg("");
      setError("");

      const payload = structuredClone(resume);

      // normalize skills (string array)
      if (Array.isArray(payload.skills)) {
        payload.skills = skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const res = await updateResumeApi(accessToken, id, payload);
      setMsg(res.data.message || "Resume updated ✅");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-3xl bg-white border p-6">
          <p className="text-slate-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-3xl bg-white border p-6">
          <p className="text-red-600 font-semibold">
            {error || "Resume not found"}
          </p>
          <Link
            to="/dashboard/resumes"
            className="inline-block mt-4 font-bold hover:underline"
          >
            ← Back to Resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="rounded-3xl bg-white border p-6 sm:p-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Resume Builder</p>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {resume.title}
            </h1>
            <p className="text-slate-600 mt-1">
              Fill details carefully — this will affect ATS score.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/dashboard/resumes/${id}/preview`)}
              className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
            >
              Preview
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {msg && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {msg}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Personal */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900">Personal</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={resume.personal?.fullName || ""}
              onChange={(e) => updateField("personal.fullName", e.target.value)}
              placeholder="Full Name"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              value={resume.personal?.email || ""}
              onChange={(e) => updateField("personal.email", e.target.value)}
              placeholder="Email"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              value={resume.personal?.phone || ""}
              onChange={(e) => updateField("personal.phone", e.target.value)}
              placeholder="Phone"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              value={resume.personal?.location || ""}
              onChange={(e) => updateField("personal.location", e.target.value)}
              placeholder="Location"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              value={resume.personal?.linkedin || ""}
              onChange={(e) => updateField("personal.linkedin", e.target.value)}
              placeholder="LinkedIn"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 md:col-span-2"
            />
            <input
              value={resume.personal?.github || ""}
              onChange={(e) => updateField("personal.github", e.target.value)}
              placeholder="GitHub"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              value={resume.personal?.portfolio || ""}
              onChange={(e) =>
                updateField("personal.portfolio", e.target.value)
              }
              placeholder="Portfolio"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900">Summary</h2>
          <textarea
            value={resume.summary || ""}
            onChange={(e) => updateField("summary", e.target.value)}
            rows={4}
            placeholder="Write a short ATS-friendly summary..."
            className="mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none"
          />
        </section>

        {/* Skills */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900">Skills</h2>
          <p className="text-sm text-slate-600 mt-1">Comma separated</p>

          <input
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="React, Node.js, MongoDB, Express..."
            className="mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />
        </section>

        {/* Education */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Education</h2>
            <button
              onClick={() => addItem("education")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {(resume.education || []).map((ed, idx) => (
              <div key={idx} className="border rounded-2xl p-5">
                <div className="flex justify-between gap-3">
                  <p className="font-extrabold text-slate-900">
                    Education #{idx + 1}
                  </p>
                  <button
                    onClick={() => removeItem("education", idx)}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={ed.degree || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "education",
                        idx,
                        "degree",
                        e.target.value
                      )
                    }
                    placeholder="Degree"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ed.institute || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "education",
                        idx,
                        "institute",
                        e.target.value
                      )
                    }
                    placeholder="Institute"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ed.startYear || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "education",
                        idx,
                        "startYear",
                        e.target.value
                      )
                    }
                    placeholder="Start Year"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ed.endYear || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "education",
                        idx,
                        "endYear",
                        e.target.value
                      )
                    }
                    placeholder="End Year"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            ))}

            {(resume.education || []).length === 0 && (
              <p className="text-slate-600 text-sm">No education added.</p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Projects</h2>
            <button
              onClick={() => addItem("projects")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {(resume.projects || []).map((p, idx) => (
              <div key={idx} className="border rounded-2xl p-5">
                <div className="flex justify-between gap-3">
                  <p className="font-extrabold text-slate-900">
                    Project #{idx + 1}
                  </p>
                  <button
                    onClick={() => removeItem("projects", idx)}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={p.title || ""}
                    onChange={(e) =>
                      updateArrayItem("projects", idx, "title", e.target.value)
                    }
                    placeholder="Project Title"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={p.link || ""}
                    onChange={(e) =>
                      updateArrayItem("projects", idx, "link", e.target.value)
                    }
                    placeholder="Project Link"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={(p.techStack || []).join(", ")}
                    onChange={(e) =>
                      updateArrayItem(
                        "projects",
                        idx,
                        "techStack",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="Tech Stack (comma separated)"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 md:col-span-2"
                  />
                  <textarea
                    value={p.description || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "projects",
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Project description..."
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none md:col-span-2"
                  />
                </div>
              </div>
            ))}

            {(resume.projects || []).length === 0 && (
              <p className="text-slate-600 text-sm">No projects added.</p>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="rounded-3xl bg-white border p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Experience
            </h2>
            <button
              onClick={() => addItem("experience")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {(resume.experience || []).map((ex, idx) => (
              <div key={idx} className="border rounded-2xl p-5">
                <div className="flex justify-between gap-3">
                  <p className="font-extrabold text-slate-900">
                    Experience #{idx + 1}
                  </p>
                  <button
                    onClick={() => removeItem("experience", idx)}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={ex.role || ""}
                    onChange={(e) =>
                      updateArrayItem("experience", idx, "role", e.target.value)
                    }
                    placeholder="Role"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ex.company || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        idx,
                        "company",
                        e.target.value
                      )
                    }
                    placeholder="Company"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ex.startDate || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        idx,
                        "startDate",
                        e.target.value
                      )
                    }
                    placeholder="Start Date"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input
                    value={ex.endDate || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        idx,
                        "endDate",
                        e.target.value
                      )
                    }
                    placeholder="End Date"
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <textarea
                    value={ex.description || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Describe your work..."
                    className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none md:col-span-2"
                  />
                </div>
              </div>
            ))}

            {(resume.experience || []).length === 0 && (
              <p className="text-slate-600 text-sm">No experience added.</p>
            )}
          </div>
        </section>

        {/* bottom actions */}
        <div className="pb-10 flex justify-end gap-2">
          <Link
            to="/dashboard/resumes"
            className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
          >
            Back
          </Link>

          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}
