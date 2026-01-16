import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-slate-900">
            TalentBridge
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white border rounded-3xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Job Portal + ATS Resume Builder
          </h1>

          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl">
            TalentBridge helps students create ATS-friendly resumes, check ATS score,
            and apply to jobs. Recruiters can post jobs and shortlist applicants.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 text-center"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl text-sm font-semibold border hover:bg-slate-50 text-center"
            >
              Dashboard 
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
