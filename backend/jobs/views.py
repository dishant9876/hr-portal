from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from recruiter.models import Recruiter

from .models import Job
from .serializers import JobSerializer


class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = None


class RecruiterJobListCreateView(generics.ListCreateAPIView):
    """List and create jobs belonging only to the authenticated recruiter."""

    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = JobPagination

    def get_recruiter(self):
        try:
            return Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can manage jobs.") from error

    def get_queryset(self):
        self.get_recruiter()
        return Job.objects.filter(recruiter=self.request.user).order_by("-created_at", "-id")

    def perform_create(self, serializer):
        self.get_recruiter()
        serializer.save(recruiter=self.request.user)


class RecruiterJobDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can manage jobs.") from error
        return Job.objects.filter(recruiter=self.request.user)


class RecruiterJobCloseView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            Recruiter.objects.get(user=self.request.user)
        except Recruiter.DoesNotExist as error:
            raise PermissionDenied("Only recruiter accounts can close jobs.") from error
        return Job.objects.filter(recruiter=self.request.user, is_open=True)

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        job.is_open = False
        job.save(update_fields=["is_open"])
        return Response(self.get_serializer(job).data)
