from django.db import models

class Student(models.Model):
    StudentMail = models.EmailField(unique=True)
    StudentName = models.CharField(max_length=255)
    Tokens = models.IntegerField(default=0)
    ExpectedPosition = models.CharField(max_length=255, blank=True, default="")
    Designation = models.CharField(max_length=255, blank=True, default="")
    Resume = models.CharField(max_length=500, blank=True, default="")
    OurFeedback = models.CharField(max_length=500, blank=True, default="")
    ImprovementsNeeded = models.CharField(max_length=500, blank=True, default="")

class Candidate(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="candidates"
    )
    Scores = models.JSONField(default=list, blank=True)
