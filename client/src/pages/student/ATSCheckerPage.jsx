import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { getMyResumesApi } from "../../services/resumeApi";
import { analyzeAtsApi } from "../../services/atsApi";

const pill = "text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50";

export default function ATSCheckerPage() {
  const { accessToken } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMyResumesApi(accessToken);
      const list = res.data.resumes || [];
      setResumes(list);

      const active = list.find((r) => r.isActive);
      setResumeId(active?._id || list[0]?._id || "");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const analyze = async () => {
    if (!resumeId) return setError("Please select a resume");
    if (!jobDescription.trim()) return setError("Please paste job description");

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      const res = await analyzeAtsApi(accessToken, {
        resumeId,
        jobDescription,
      });

      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "ATS analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const score = result?.score ?? null;

  const scoreStyle = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200 text-green-700";
    if (score >= 60) return "bg-blue-50 border-blue-200 text-blue-700";
    if (score >= 40) return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-red-50 border-red-200 text-red-700";
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border p-6">
        <p className="text-slate-600">Loading ATS checker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">ATS Checker</h1>
        <p className="text-slate-600 mt-1">
          Paste Job Description and check if your resume is ATS-friendly.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input section */}
      <div className="rounded-3xl bg-white border p-6 sm:p-8 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Select Resume
          </label>

          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">-- Select Resume --</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title} {r.isActive ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Paste Job Description
          </label>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the full job description here..."
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={analyze}
            disabled={analyzing}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {analyzing ? "Analyzing..." : "Analyze ATS"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-3xl bg-white border p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                ATS Result
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Improve your score by adding missing keywords naturally.
              </p>
            </div>

            {score !== null && (
              <div
                className={`px-6 py-3 rounded-2xl border text-center ${scoreStyle(
                  score
                )}`}
              >
                <p className="text-xs font-bold uppercase tracking-wide">
                  Score
                </p>
                <p className="text-2xl font-extrabold">{score}%</p>
              </div>
            )}
          </div>

          {/* Matched */}
          <div>
            <h3 className="font-extrabold text-slate-900">Matched Keywords</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result.matchedKeywords || []).length === 0 ? (
                <p className="text-slate-600 text-sm">No matched keywords.</p>
              ) : (
                result.matchedKeywords.map((k, i) => (
                  <span key={i} className={`${pill} border-green-200 bg-green-50 text-green-700`}>
                    {k}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Missing */}
          <div>
            <h3 className="font-extrabold text-slate-900">Missing Keywords</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result.missingKeywords || []).length === 0 ? (
                <p className="text-slate-600 text-sm">No missing keywords 🎉</p>
              ) : (
                result.missingKeywords.map((k, i) => (
                  <span key={i} className={`${pill} border-red-200 bg-red-50 text-red-700`}>
                    {k}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-extrabold text-slate-900">Suggestions</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              {(result.suggestions || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
