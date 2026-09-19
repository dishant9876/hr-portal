from django.urls import path

from .views import RecruiterJobCloseView, RecruiterJobDetailView, RecruiterJobListCreateView


urlpatterns = [
    path("recruiter/jobs/", RecruiterJobListCreateView.as_view(), name="recruiter-jobs"),
    path("recruiter/jobs/<int:pk>/", RecruiterJobDetailView.as_view(), name="recruiter-job-detail"),
    path("recruiter/jobs/<int:pk>/close/", RecruiterJobCloseView.as_view(), name="recruiter-job-close"),
]
