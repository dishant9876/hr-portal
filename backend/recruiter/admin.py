from django.contrib import admin
from .models import Recruiter

@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'company_name')
    search_fields = ('name', 'email', 'company_name')
