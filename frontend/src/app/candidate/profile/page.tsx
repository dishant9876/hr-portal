import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CandidateProfileCard from "@/components/CandidateProfileCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CandidateProfilePage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="ml-72 flex-1 p-8">
          {/* <Navbar /> */}
          <div className="mt-8">
            <CandidateProfileCard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
