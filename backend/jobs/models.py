from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


class Job(models.Model):

    JOB_TYPES = [

        ("full_time", "Full Time"),

        ("part_time", "Part Time"),

        ("internship", "Internship"),

        ("contract", "Contract"),
    ]

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(
        max_length=255
    )

    company_name = models.CharField(
        max_length=255
    )

    location = models.CharField(
        max_length=255
    )

    description = models.TextField()

    requirements = models.TextField()

    salary = models.CharField(
        max_length=100
    )

    job_type = models.CharField(
        max_length=50,
        choices=JOB_TYPES
    )

    experience_range = models.CharField(
        max_length=100
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.title