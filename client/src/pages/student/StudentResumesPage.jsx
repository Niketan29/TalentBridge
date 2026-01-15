import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  createResumeApi,
  getMyResumesApi,
  deleteResumeApi,
  setActiveResumeApi,
} from "../../services/resumeApi";

export default function StudentResumesPage() {
  const { accessToken } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("My Resume");

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyResumesApi(accessToken);
      setResumes(res.data.resumes || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    try {
      setCreating(true);
      setError("");
      setMsg("");

      const res = await createResumeApi(accessToken, { title });
      setMsg(res.data.message || "Resume created ✅");
      setTitle("My Resume");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create resume");
    } finally {
      setCreating(false);
    }
  };

  const setActive = async (id) => {
    try {
      setError("");
      setMsg("");
      await setActiveResumeApi(accessToken, id);
      setMsg("Active resume updated ✅");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to set active resume");
    }
  };

  const remove = async (id) => {
    const ok = confirm("Delete this resume?");
    if (!ok) return;

    try {
      setError("");
      setMsg("");
      await deleteResumeApi(accessToken, id);
      setMsg("Resume deleted ✅");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete resume");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Resumes</h1>
        <p className="text-slate-600 mt-1">
          Create and manage ATS-friendly resumes.
        </p>
      </div>

      {/* create resume */}
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h2 className="font-extrabold text-slate-900">Create New Resume</h2>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Resume title"
          />
          <button
            onClick={createResume}
            disabled={creating}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {creating ? "Creating..." : "+ Create"}
          </button>
        </div>

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
      </div>

      {/* list */}
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        {loading && <p className="text-slate-600">Loading...</p>}

        {!loading && resumes.length === 0 && (
          <p className="text-slate-600">No resumes yet.</p>
        )}

        {!loading && resumes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resumes.map((r) => (
              <div key={r._id} className="border rounded-2xl p-5 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-900 text-lg">
                      {r.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Updated: {new Date(r.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  {r.isActive ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => setActive(r._id)}
                      className="text-xs font-bold px-3 py-1 rounded-full border hover:bg-slate-50"
                    >
                      Set Active
                    </button>
                  )}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/dashboard/resumes/${r._id}/edit`}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 text-center"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/dashboard/resumes/${r._id}/preview`}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50 text-center"
                  >
                    Preview
                  </Link>

                  <button
                    onClick={() => remove(r._id)}
                    className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
