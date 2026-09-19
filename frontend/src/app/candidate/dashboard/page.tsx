import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import ProtectedRoute from "@/components/ProtectedRoute";
import CandidateResumePreview from "@/components/CandidateResumePreview";

export default function CandidateDashboard() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <div className="workspace-page flex">
        <Sidebar />
        <div className="workspace-content flex-1"><WorkspaceHero role="candidate" view="dashboard" />
          {/* <Navbar /> */}
          <div className="mt-8"><CandidateResumePreview /></div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
