import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterDashboard() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="ml-72 flex-1 p-8">
          {/* <Navbar /> */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-lg font-semibold text-slate-900">Total Jobs</h2>
              <p className="mt-6 text-4xl font-bold text-slate-900">12</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
              <p className="mt-6 text-4xl font-bold text-slate-900">55</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-lg font-semibold text-slate-900">Shortlisted</h2>
              <p className="mt-6 text-4xl font-bold text-slate-900">10</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
