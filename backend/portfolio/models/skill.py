from django.db import models
from .base import TimeStampedModel
from .user import User

"""
Model Skill
"""
class Skill(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label
    
    class Meta: 
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
        ordering = ['-created_at']