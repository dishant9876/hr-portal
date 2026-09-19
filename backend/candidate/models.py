from django.conf import settings
from django.db import models

# Create your models here.
class Candidate(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)

    years_of_experience = models.IntegerField()

    resume = models.FileField(
        upload_to='resumes/',
        null=True,
        blank=True
    )

    skills = models.JSONField(default=list, blank=True)
    work_experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    awards = models.JSONField(default=list, blank=True)
    hobbies = models.JSONField(default=list, blank=True)
    other_details = models.TextField(blank=True, default="")
    address = models.CharField(max_length=500, blank=True, default="")
    job_title = models.CharField(max_length=255, blank=True, default="")
    links = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return self.name
