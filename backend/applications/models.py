from django.db import models

# Create your models here.
class Application(models.Model):

    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('REVIEWED', 'Reviewed'),
        ('SHORTLISTED', 'Shortlisted'),
        ('REJECTED', 'Rejected'),
        ('HIRED', 'Hired'),
    ]

    candidate = models.ForeignKey(
        'candidate.Candidate',
        on_delete=models.CASCADE
    )

    job = models.ForeignKey(
        'jobs.Job',
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='APPLIED'
    )

    status_note = models.TextField(blank=True, default='')

    applied_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self) -> str:
        return f"{self.candidate.name} - {self.job.title}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("candidate", "job"),
                name="unique_candidate_job_application",
            ),
        ]
