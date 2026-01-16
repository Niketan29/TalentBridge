import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobByIdApi } from "../../services/jobApi";
import { useAuth } from "../../context/useAuth";
import { applyJobApi } from "../../services/applicationApi";

export default function StudentJobDetailsPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { accessToken } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [applyError, setApplyError] = useState("");

  const loadJob = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await getJobByIdApi(id);
      setJob(res.data.job);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border p-6">
        <p className="text-slate-600">Loading job...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white border p-6">
        <p className="text-red-600 font-semibold">{error}</p>
        <Link
          to="/dashboard/jobs"
          className="inline-block mt-4 text-sm font-bold text-slate-900 hover:underline"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    try {
      setApplyMsg("");
      setApplyError("");
      setApplying(true);

      const res = await applyJobApi(accessToken, id);
      setApplyMsg(res.data.message || "Applied ✅");
    } catch (err) {
      setApplyError(err?.response?.data?.message || "Apply failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <Link
          to="/dashboard/jobs"
          className="text-sm font-bold text-slate-700 hover:underline"
        >
          ← Back to Jobs
        </Link>

        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
          {job.title}
        </h1>

        <p className="text-slate-600 mt-2">
          {job.companyName} • {job.location || "Remote"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {job.jobType}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {job.experienceLevel}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {job.status}
          </span>
        </div>

        <p className="mt-4 text-slate-700 text-sm">
          <span className="font-bold">Salary:</span>{" "}
          {job.salaryRange || "Not disclosed"}
        </p>
      </div>

      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">
          Job Description
        </h2>
        <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">
          Skills Required
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {(job.skillsRequired || []).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50"
            >
              {skill}
            </span>
          ))}
        </div>

        {applyMsg && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {applyMsg}
          </div>
        )}

        {applyError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {applyError}
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={applying}
          className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {applying ? "Applying..." : "Apply Now"}
        </button>
      </div>
    </div>
  );
}
