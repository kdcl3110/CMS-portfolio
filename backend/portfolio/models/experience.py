from django.db import models
from .base import TimeStampedModel
from .user import User

"""
Model Experience
"""
class Experience(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    company = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Experience for {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'