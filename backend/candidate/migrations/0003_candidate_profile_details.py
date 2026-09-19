from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("candidate", "0002_alter_candidate_resume")]
    operations = [
        migrations.AddField(model_name="candidate", name="skills", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="work_experience", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="education", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="certifications", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="awards", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="hobbies", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="candidate", name="other_details", field=models.TextField(blank=True, default="")),
    ]
