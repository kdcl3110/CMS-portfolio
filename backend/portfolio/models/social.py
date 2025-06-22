from django.db import models
from .base import TimeStampedModel
from .user import User
from .social_type import SocialType

"""
Model Social
"""
class Social(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='socials')
    social_type = models.ForeignKey(SocialType, on_delete=models.CASCADE)
    link = models.URLField()

    def __str__(self):
        return f"{self.social_type.label} - {self.user.username}"
    
    class Meta:
        verbose_name = "Social"
        verbose_name_plural = "Socials"
        ordering = ['-created_at']