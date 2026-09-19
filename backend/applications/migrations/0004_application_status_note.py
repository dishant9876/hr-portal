from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("applications", "0003_unique_candidate_job_application")]

    operations = [migrations.AddField(model_name="application", name="status_note", field=models.TextField(blank=True, default=""))]
