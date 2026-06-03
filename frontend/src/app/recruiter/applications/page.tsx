import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="mainApp flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="ml-72 flex-1 p-8">
          {/* <Navbar /> */}
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-md">
            <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
            <p className="mt-4 text-slate-600">Review candidate applications and update hiring status.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
