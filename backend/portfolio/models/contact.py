from django.db import models
from .base import TimeStampedModel
from .user import User

"""
Model Contact
"""
class Contact(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    read = models.BooleanField(default=False)