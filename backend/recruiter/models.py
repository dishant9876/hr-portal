from django.conf import settings
from django.db import models

# Create your models here.
class Recruiter(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)

    company_name = models.CharField(max_length=255)
    company_address = models.TextField()

    def __str__(self) -> str:
        return self.name