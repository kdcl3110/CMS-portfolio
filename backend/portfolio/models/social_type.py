from django.db import models
from .base import TimeStampedModel

"""
Model SocialType
"""
class SocialType(TimeStampedModel):
    logo = models.URLField()
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label
    
    class Meta:
        verbose_name = "Social Type"
        verbose_name_plural = "Social Types"
        ordering = ['-created_at']