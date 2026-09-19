from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            "id",
            "title",
            "company_name",
            "location",
            "description",
            "requirements",
            "salary",
            "salary_period",
            "job_type",
            "experience",
            "created_at",
            "is_open",
        )
        read_only_fields = ("id", "created_at", "is_open")
