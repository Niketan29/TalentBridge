import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getResumeByIdApi } from "../../services/resumeApi";
import html2pdf from "html2pdf.js";

export default function ResumePreviewPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getResumeByIdApi(accessToken, id);
      setResume(res.data.resume);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resume preview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-white border rounded-3xl p-6">
          <p className="text-red-600 font-semibold">
            {error || "Resume not found"}
          </p>
          <Link
            to="/dashboard/resumes"
            className="inline-block mt-4 text-sm font-bold hover:underline"
          >
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const p = resume.personal || {};
  const skills = resume.skills || [];
  const education = resume.education || [];
  const projects = resume.projects || [];
  const experience = resume.experience || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header actions */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Resume Preview
            </h1>
            <p className="text-slate-600 mt-1">
              ATS-friendly clean format (recommended).
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/dashboard/resumes/${id}/edit`}
              className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-slate-50"
            >
              Edit
            </Link>

            {/* PDF download added later in roadmap */}
            <button
              onClick={() => {
                const element = document.getElementById("resume-pdf");

                const opt = {
                  margin: 10,
                  filename: `${(resume.personal?.fullName || "resume")
                    .toLowerCase()
                    .replaceAll(" ", "_")}_resume.pdf`,
                  image: { type: "jpeg", quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                };

                html2pdf().set(opt).from(element).save();
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Resume Sheet */}
        <div id="resume-pdf" className="bg-white border rounded-3xl p-8 sm:p-10"
        >
          {/* Top */}
          <div className="border-b pb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {p.fullName || "Your Name"}
            </h2>

            <div className="mt-2 text-sm text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
            </div>

            <div className="mt-2 text-sm text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
              {p.linkedin && <span>LinkedIn: {p.linkedin}</span>}
              {p.github && <span>GitHub: {p.github}</span>}
              {p.portfolio && <span>Portfolio: {p.portfolio}</span>}
            </div>
          </div>

          {/* Summary */}
          {resume.summary && (
            <section className="mt-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Summary
              </h3>
              <p className="mt-2 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {resume.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Skills
              </h3>
              <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                {skills.join(" • ")}
              </p>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Education
              </h3>

              <div className="mt-2 space-y-3">
                {education.map((ed, i) => (
                  <div key={i} className="text-sm text-slate-800">
                    <p className="font-bold">
                      {ed.degree || "Degree"} — {ed.institute || "Institute"}
                    </p>
                    <p className="text-slate-600">
                      {(ed.startYear || "") +
                        (ed.endYear ? ` - ${ed.endYear}` : "")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Projects
              </h3>

              <div className="mt-2 space-y-4">
                {projects.map((pr, i) => (
                  <div key={i} className="text-sm text-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{pr.title || "Project Title"}</p>
                      {pr.link && (
                        <span className="text-slate-600">({pr.link})</span>
                      )}
                    </div>

                    {pr.techStack?.length > 0 && (
                      <p className="text-slate-600 mt-1">
                        Tech: {pr.techStack.join(", ")}
                      </p>
                    )}

                    {pr.description && (
                      <p className="mt-1 leading-relaxed whitespace-pre-line">
                        {pr.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Experience
              </h3>

              <div className="mt-2 space-y-4">
                {experience.map((ex, i) => (
                  <div key={i} className="text-sm text-slate-800">
                    <p className="font-bold">
                      {ex.role || "Role"} — {ex.company || "Company"}
                    </p>
                    <p className="text-slate-600">
                      {(ex.startDate || "") +
                        (ex.endDate ? ` - ${ex.endDate}` : "")}
                    </p>

                    {ex.description && (
                      <p className="mt-1 leading-relaxed whitespace-pre-line">
                        {ex.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pb-10">
          <Link
            to="/dashboard/resumes"
            className="text-sm font-bold text-slate-900 hover:underline"
          >
            ← Back to Resumes
          </Link>
        </div>
      </div>
    </div>
  );
}
