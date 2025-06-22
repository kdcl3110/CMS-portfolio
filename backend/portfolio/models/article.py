from django.db import models
from .base import TimeStampedModel
from .category import Category
from .user import User

"""
Model Article
"""
class Article(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    coverage_image = models.URLField(blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        indexes = [ 
            models.Index(fields=['-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['category']),
        ]

    