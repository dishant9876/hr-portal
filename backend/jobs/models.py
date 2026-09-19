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

    EXPERIENCE_CHOICES = [
        ("fresher", "Fresher (0 years)"),
        ("1_2", "1–2 years"),
        ("3_5", "3–5 years"),
        ("6_9", "6–9 years"),
        ("10_plus", "10+ years"),
    ]

    SALARY_PERIOD_CHOICES = [
        ("hour", "Per hour"),
        ("day", "Per day"),
        ("week", "Per week"),
        ("month", "Per month"),
        ("year", "Per year"),
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

    salary = models.PositiveIntegerField()

    salary_period = models.CharField(max_length=10, choices=SALARY_PERIOD_CHOICES, default="year")

    job_type = models.CharField(
        max_length=50,
        choices=JOB_TYPES
    )

    experience = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_open = models.BooleanField(default=True)

    def __str__(self):

        return self.title
