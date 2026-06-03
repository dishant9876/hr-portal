from django.conf import settings
from django.db import models


# Profile to store simple role for a user (mutually exclusive)
class Profile(models.Model):
	ROLE_CHOICES = (
		("recruiter", "Recruiter"),
		("candidate", "Candidate"),
	)

	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES)

	def __str__(self) -> str:
		return f"{self.user.email} ({self.role})"
