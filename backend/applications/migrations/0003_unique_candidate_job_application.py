from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("applications", "0002_application_applied_at"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="application",
            constraint=models.UniqueConstraint(
                fields=("candidate", "job"),
                name="unique_candidate_job_application",
            ),
        ),
    ]
