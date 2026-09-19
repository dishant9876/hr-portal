from rest_framework import serializers

from jobs.models import Job

from .models import Application


class CandidateJobSerializer(serializers.ModelSerializer):
    is_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            "id", "title", "company_name", "location", "description",
            "requirements", "salary", "salary_period", "job_type", "experience",
            "created_at", "is_open", "is_applied",
        )

    def get_is_applied(self, job):
        applied_job_ids = self.context.get("applied_job_ids", set())
        return job.id in applied_job_ids


class RecruiterApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    candidate_email = serializers.EmailField(source="candidate.email", read_only=True)
    candidate_phone_number = serializers.CharField(source="candidate.phone_number", read_only=True)
    candidate_experience = serializers.IntegerField(source="candidate.years_of_experience", read_only=True)
    resume_url = serializers.SerializerMethodField()
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)

    class Meta:
        model = Application
        fields = (
            "id", "status", "applied_at", "job_title", "company_name",
            "candidate_name", "candidate_email", "candidate_phone_number",
            "candidate_experience", "resume_url", "status_note",
        )

    def get_resume_url(self, application):
        if not application.candidate.resume:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(application.candidate.resume.url) if request else application.candidate.resume.url


class CandidateApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)
    job_location = serializers.CharField(source="job.location", read_only=True)
    job_is_open = serializers.BooleanField(source="job.is_open", read_only=True)
    job_description = serializers.CharField(source="job.description", read_only=True)
    job_requirements = serializers.CharField(source="job.requirements", read_only=True)
    job_experience = serializers.CharField(source="job.experience", read_only=True)
    job_salary = serializers.IntegerField(source="job.salary", read_only=True)
    job_salary_period = serializers.CharField(source="job.salary_period", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "status", "status_note", "applied_at", "job_title", "company_name", "job_location", "job_is_open", "job_description", "job_requirements", "job_experience", "job_salary", "job_salary_period")


class ApplicantProfileSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()

    class Meta:
        from candidate.models import Candidate
        model = Candidate
        fields = ("name", "email", "phone_number", "years_of_experience", "skills", "work_experience", "education", "certifications", "awards", "hobbies", "other_details", "resume_url")

    def get_resume_url(self, candidate):
        if not candidate.resume:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(candidate.resume.url) if request else candidate.resume.url


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ("id", "status", "status_note")

    def validate(self, attrs):
        if "status" in attrs and attrs["status"] != self.instance.status and not attrs.get("status_note", "").strip():
            raise serializers.ValidationError({"status_note": "Please provide a message for the candidate."})
        return attrs
