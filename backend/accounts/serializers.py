from django.contrib.auth import get_user_model
from rest_framework import serializers
from recruiter.models import Recruiter
from candidate.models import Candidate
from .models import Profile

User = get_user_model()

class RecruiterRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(max_length=20)
    company_name = serializers.CharField(max_length=255)
    company_address = serializers.CharField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError({"email": "This email id already exists."})
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        recruiter = Recruiter.objects.create(
            user=user,
            name=validated_data["name"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            company_name=validated_data["company_name"],
            company_address=validated_data["company_address"],
        )
        Profile.objects.create(user=user, role="recruiter")
        return recruiter

class CandidateRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(max_length=20)
    years_of_experience = serializers.IntegerField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError({"email": "This email id already exists."})
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        candidate = Candidate.objects.create(
            user=user,
            name=validated_data["name"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            years_of_experience=validated_data["years_of_experience"],
        )
        Profile.objects.create(user=user, role="candidate")
        return candidate
