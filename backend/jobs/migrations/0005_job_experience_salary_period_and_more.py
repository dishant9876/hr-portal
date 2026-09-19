from django.db import migrations, models


def normalise_existing_jobs(apps, schema_editor):
    Job = apps.get_model("jobs", "Job")
    experience_map = {"0": "fresher", "1": "1_2", "2": "1_2", "3": "3_5", "4": "3_5", "5": "3_5", "6": "6_9", "7": "6_9", "8": "6_9", "9": "6_9"}
    for job in Job.objects.all():
        job.experience = experience_map.get(job.experience, "10_plus")
        try:
            job.salary = int(job.salary)
        except (TypeError, ValueError):
            job.salary = 0
        job.save(update_fields=["experience", "salary"])


class Migration(migrations.Migration):
    dependencies = [("jobs", "0004_job_is_open")]

    operations = [
        migrations.RenameField(model_name="job", old_name="experience_range", new_name="experience"),
        migrations.AddField(model_name="job", name="salary_period", field=models.CharField(choices=[("hour", "Per hour"), ("day", "Per day"), ("week", "Per week"), ("month", "Per month"), ("year", "Per year")], default="year", max_length=10)),
        migrations.RunPython(normalise_existing_jobs, migrations.RunPython.noop),
        migrations.AlterField(model_name="job", name="experience", field=models.CharField(choices=[("fresher", "Fresher (0 years)"), ("1_2", "1–2 years"), ("3_5", "3–5 years"), ("6_9", "6–9 years"), ("10_plus", "10+ years")], max_length=20)),
        migrations.AlterField(model_name="job", name="salary", field=models.PositiveIntegerField()),
    ]
