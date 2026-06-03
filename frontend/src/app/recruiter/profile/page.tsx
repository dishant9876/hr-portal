import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import RecruiterProfileCard from "@/components/RecruiterProfileCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterProfilePage() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="ml-72 flex-1 p-8">
          {/* <Navbar /> */}
          <div className="mt-8">
            <RecruiterProfileCard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
