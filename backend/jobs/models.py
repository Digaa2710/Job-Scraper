from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=255)
    experience = models.CharField(max_length=255)
    openings = models.CharField(max_length=255)
    link = models.URLField()

    def __str__(self):
        return self.title
