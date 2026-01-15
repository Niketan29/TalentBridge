import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobsApi } from "../../services/jobApi";

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    location: "",
    jobType: "",
    experienceLevel: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const loadJobs = async () => {
    try {
      setError("");
      setLoading(true);

      // remove empty filters
      const params = {};
      Object.keys(filters).forEach((k) => {
        if (filters[k]) params[k] = filters[k];
      });

      const res = await getAllJobsApi(params);
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Jobs</h1>
        <p className="text-slate-600 mt-1">
          Browse jobs and apply with your ATS resume.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h2 className="font-extrabold text-slate-900">Search & Filters</h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="q"
            value={filters.q}
            onChange={onChange}
            placeholder="Search job title, skills, company..."
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 md:col-span-2"
          />

          <input
            name="location"
            value={filters.location}
            onChange={onChange}
            placeholder="Location (e.g. Pune)"
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />

          <button
            onClick={loadJobs}
            className="rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 px-4 py-3"
          >
            Search
          </button>

          <select
            name="jobType"
            value={filters.jobType}
            onChange={onChange}
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>

          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={onChange}
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="">Experience</option>
            <option value="fresher">Fresher</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setFilters({ q: "", location: "", jobType: "", experienceLevel: "" });
              setTimeout(loadJobs, 0);
            }}
            className="rounded-xl border text-sm font-semibold hover:bg-slate-50 px-4 py-3"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        {loading && <p className="text-slate-600">Loading jobs...</p>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-slate-600">No jobs found.</p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-2xl p-5 hover:shadow-sm transition bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {job.companyName} • {job.location || "Remote"}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {job.jobType}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(job.skillsRequired || []).slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    {job.salaryRange || "Salary not disclosed"} •{" "}
                    {job.experienceLevel}
                  </p>

                  <Link
                    to={`/dashboard/jobs/${job._id}`}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
