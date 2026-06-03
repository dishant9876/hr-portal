import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterJobsPage() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="ml-72 flex-1 p-8">
          {/* <Navbar /> */}
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-md">
            <h1 className="text-2xl font-semibold text-slate-900">Jobs</h1>
            <p className="mt-4 text-slate-600">Manage posted jobs and review job details from here.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
