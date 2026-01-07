from django.db import models

# Create your models here.
class Organization(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    tokens = models.IntegerField(default=0)
    org_size = models.CharField(max_length=50)


class Candidate(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="candidates"
    )
    name = models.CharField(max_length=255)
    resume_info = models.TextField()


class CandidateScore(models.Model):
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name="scores"
    )
    score = models.IntegerField()
