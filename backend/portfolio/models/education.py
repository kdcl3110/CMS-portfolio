from django.db import models
from .base import TimeStampedModel
from .user import User

"""
Model Education
"""
class Education(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='educations')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    school = models.CharField(max_length=255)

    def __str__(self):
        return f"Education for {self.user.username} - School: {self.school}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Education'
        verbose_name_plural = 'Educations'
