import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import Navbar from "@/components/Navbar";
import CandidateProfileCard from "@/components/CandidateProfileCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CandidateProfilePage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <div className="workspace-page flex">
        <Sidebar />
        <div className="workspace-content flex-1"><WorkspaceHero role="candidate" view="profile" />
          {/* <Navbar /> */}
          <div className="mt-8">
            <CandidateProfileCard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
