from django.db import models
from .base import TimeStampedModel
from .user import User

"""
Models Settings
"""
class Settings(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    color = models.CharField(max_length=20)

    def __str__(self):
        return f"Settings for {self.user.username} - Color: {self.color}"
    
    class Meta:
        verbose_name = "Settings"
        verbose_name_plural = "Settings"
        ordering = ['-created_at']