from django.db import models
from .base import TimeStampedModel

"""
Model Category
"""
class Category(TimeStampedModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['-created_at']