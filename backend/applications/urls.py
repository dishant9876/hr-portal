from django.urls import path

from .views import CandidateApplicationListView, CandidateJobListView, JobApplyView, RecruiterApplicantProfileView, RecruiterApplicationDetailView, RecruiterApplicationListView, RecruiterDashboardStatsView


urlpatterns = [
    path("candidate/jobs/", CandidateJobListView.as_view(), name="candidate-jobs"),
    path("candidate/jobs/<int:job_id>/apply/", JobApplyView.as_view(), name="job-apply"),
    path("candidate/applications/", CandidateApplicationListView.as_view(), name="candidate-applications"),
    path("recruiter/applications/", RecruiterApplicationListView.as_view(), name="recruiter-applications"),
    path("recruiter/applications/<int:pk>/", RecruiterApplicationDetailView.as_view(), name="recruiter-application-detail"),
    path("recruiter/applications/<int:pk>/candidate/", RecruiterApplicantProfileView.as_view(), name="recruiter-applicant-profile"),
    path("recruiter/dashboard/", RecruiterDashboardStatsView.as_view(), name="recruiter-dashboard"),
]
