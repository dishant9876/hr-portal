from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [("candidate", "0003_candidate_profile_details")]
    operations = [
        migrations.AddField(model_name="candidate", name="address", field=models.CharField(max_length=500, blank=True, default="")),
        migrations.AddField(model_name="candidate", name="job_title", field=models.CharField(max_length=255, blank=True, default="")),
        migrations.AddField(model_name="candidate", name="links", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="projects", field=models.JSONField(blank=True, default=list)),
    ]
