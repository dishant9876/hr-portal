from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("jobs", "0003_remove_job_experience_required_job_company_name_and_more")]

    operations = [migrations.AddField(model_name="job", name="is_open", field=models.BooleanField(default=True))]
