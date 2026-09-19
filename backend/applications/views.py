from rest_framework import generics, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count

from candidate.models import Candidate
from jobs.models import Job
from recruiter.models import Recruiter

from .models import Application
from .serializers import ApplicantProfileSerializer, ApplicationStatusSerializer, CandidateApplicationSerializer, CandidateJobSerializer, RecruiterApplicationSerializer


class TenPerPagePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = None


def candidate_for(user):
    try:
        return Candidate.objects.get(user=user)
    except Candidate.DoesNotExist as error:
        raise PermissionDenied("Only candidate accounts can apply for jobs.") from error


class CandidateJobListView(generics.ListAPIView):
    serializer_class = CandidateJobSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        candidate = candidate_for(self.request.user)
        self.applied_job_ids = set(
            Application.objects.filter(candidate=candidate).values_list("job_id", flat=True)
        )
        return Job.objects.select_related("recruiter").filter(is_open=True).order_by("-created_at", "-id")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["applied_job_ids"] = getattr(self, "applied_job_ids", set())
        return context


class JobApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        candidate = candidate_for(request.user)
        resume = request.FILES.get("resume")
        if not resume:
            return Response({"resume": ["Please upload your resume before applying."]}, status=status.HTTP_400_BAD_REQUEST)
        try:
            job = Job.objects.get(pk=job_id, is_open=True)
        except Job.DoesNotExist as error:
            raise NotFound("This job is no longer open for applications.") from error

        application, created = Application.objects.get_or_create(candidate=candidate, job=job)
        if not created:
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        candidate.resume = resume
        candidate.save(update_fields=["resume"])
        return Response({"id": application.id, "status": application.status}, status=status.HTTP_201_CREATED)


class RecruiterApplicationListView(generics.ListAPIView):
    serializer_class = RecruiterApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        try:
            Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can view applications.") from error
        queryset = Application.objects.select_related("candidate", "job").filter(
            job__recruiter=self.request.user
        )
        status_value = self.request.query_params.get("status")
        valid_statuses = {choice[0] for choice in Application.STATUS_CHOICES}
        if status_value in valid_statuses:
            queryset = queryset.filter(status=status_value)
        return queryset.order_by("-applied_at", "-id")


class RecruiterApplicationDetailView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can update applications.") from error
        return Application.objects.filter(job__recruiter=self.request.user)


class RecruiterApplicantProfileView(generics.RetrieveAPIView):
    serializer_class = ApplicantProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can view applicant profiles.") from error
        application = Application.objects.select_related("candidate").filter(pk=self.kwargs["pk"], job__recruiter=self.request.user).first()
        if not application:
            raise NotFound("Application not found.")
        return application.candidate


class CandidateApplicationListView(generics.ListAPIView):
    serializer_class = CandidateApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        candidate = candidate_for(self.request.user)
        return Application.objects.select_related("job").filter(candidate=candidate).order_by("-applied_at", "-id")


class RecruiterDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            Recruiter.objects.get(user=request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can view this dashboard.") from error

        applications = Application.objects.filter(job__recruiter=request.user)
        status_counts = {choice[0]: 0 for choice in Application.STATUS_CHOICES}
        status_counts.update({row["status"]: row["count"] for row in applications.values("status").annotate(count=Count("id"))})
        return Response({
            "total_jobs": Job.objects.filter(recruiter=request.user).count(),
            "total_applications": applications.count(),
            "status_counts": status_counts,
        })
