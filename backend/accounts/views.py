from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CandidateRegistrationSerializer, RecruiterRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from recruiter.models import Recruiter
from candidate.models import Candidate

User = get_user_model()

class RecruiterRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecruiterRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recruiter = serializer.save()
        user = recruiter.user
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "id": recruiter.id,
                "email": user.email,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )

class CandidateRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CandidateRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        candidate = serializer.save()
        user = candidate.user
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "id": candidate.id,
                "email": user.email,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class RoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            return Response({"role": profile.role}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"role": None}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {"email": user.email}

        try:
            profile = Profile.objects.get(user=user)
            data["role"] = profile.role
        except Profile.DoesNotExist:
            data["role"] = None

        # Try recruiter
        try:
            recruiter = Recruiter.objects.get(user=user)
            data.update({
                "name": recruiter.name,
                "phone_number": recruiter.phone_number,
                "company_name": recruiter.company_name,
                "company_address": recruiter.company_address,
            })
            return Response(data, status=status.HTTP_200_OK)
        except Recruiter.DoesNotExist:
            pass

        # Try candidate
        try:
            candidate = Candidate.objects.get(user=user)
            data.update({
                "name": candidate.name,
                "phone_number": candidate.phone_number,
                "years_of_experience": candidate.years_of_experience,
                "skills": candidate.skills,
                "work_experience": candidate.work_experience,
                "education": candidate.education,
                "certifications": candidate.certifications,
                "awards": candidate.awards,
                "hobbies": candidate.hobbies,
                "other_details": candidate.other_details,
                "address": candidate.address, "job_title": candidate.job_title,
                "links": candidate.links, "projects": candidate.projects,
            })
            return Response(data, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            pass

        # Fallback to username
        data.setdefault("name", user.username)
        return Response(data, status=status.HTTP_200_OK)

class RecruiterProfileUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        try:

            recruiter = Recruiter.objects.get(
                user=request.user
            )

        except Recruiter.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Recruiter profile not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data

        # Update fields

        recruiter.name = data.get(
            "name",
            recruiter.name
        )

        recruiter.phone_number = data.get(
            "phone_number",
            recruiter.phone_number
        )

        recruiter.company_name = data.get(
            "company_name",
            recruiter.company_name
        )

        recruiter.company_address = data.get(
            "company_address",
            recruiter.company_address
        )

        recruiter.save()

        # Update user email

        user = request.user

        user.email = data.get(
            "email",
            user.email
        )

        user.save()

        return Response(
            {
                "name":
                    recruiter.name,

                "email":
                    user.email,

                "phone_number":
                    recruiter.phone_number,

                "company_name":
                    recruiter.company_name,

                "company_address":
                    recruiter.company_address,
            },
            status=status.HTTP_200_OK,
        )


class CandidateProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
            return Response({"detail": "Candidate profile not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field in ("name", "phone_number", "years_of_experience", "skills", "work_experience", "education", "certifications", "awards", "hobbies", "other_details", "address", "job_title", "links", "projects"):
            if field in data:
                setattr(candidate, field, data[field])
        candidate.save()
        request.user.email = data.get("email", request.user.email)
        request.user.save(update_fields=["email"])
        candidate.email = request.user.email
        candidate.save(update_fields=["email"])
        return Response({
            "name": candidate.name, "email": candidate.email, "phone_number": candidate.phone_number,
            "years_of_experience": candidate.years_of_experience, "skills": candidate.skills,
            "work_experience": candidate.work_experience, "education": candidate.education,
            "certifications": candidate.certifications, "awards": candidate.awards,
            "hobbies": candidate.hobbies, "other_details": candidate.other_details,
            "address": candidate.address, "job_title": candidate.job_title,
            "links": candidate.links, "projects": candidate.projects,
        })
