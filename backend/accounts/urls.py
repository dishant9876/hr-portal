from django.urls import path
from .views import CandidateRegisterView, RecruiterRegisterView, RoleView, ProfileView, RecruiterProfileUpdateView

urlpatterns = [
    path('register/recruiter/', RecruiterRegisterView.as_view(), name='register-recruiter'),
    path('register/candidate/', CandidateRegisterView.as_view(), name='register-candidate'),
    path('role/', RoleView.as_view(), name='user-role'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path("profile/update/", RecruiterProfileUpdateView.as_view(),),
]
