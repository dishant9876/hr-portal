import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import Navbar from "@/components/Navbar";
import RecruiterProfileCard from "@/components/RecruiterProfileCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterProfilePage() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="workspace-page flex">
        <Sidebar />
        <div className="workspace-content flex-1"><WorkspaceHero role="recruiter" view="profile" />
          {/* <Navbar /> */}
          <div className="mt-8">
            <RecruiterProfileCard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
