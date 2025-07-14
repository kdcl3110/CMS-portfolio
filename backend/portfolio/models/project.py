from django.db import models
from .base import TimeStampedModel
from .user import User
import os
import uuid
from django.conf import settings

def project_image_upload_path(instance, filename):
    """
    Fonction pour définir le chemin d'upload des images de projet
    """
    ext = filename.split('.')[-1]
    filename = f"project_{instance.user.username}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('projects', 'images', filename)

"""
Model Project
"""
class Project(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Image avec upload et URL
    image = models.ImageField(
        upload_to=project_image_upload_path,
        null=True,
        blank=True,
        help_text="Image du projet (formats supportés: PNG, JPG, JPEG, WebP)"
    )
    image_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL de l'image (généré automatiquement après upload ou URL externe)"
    )
    
    # Technologies (JSON field pour stocker une liste)
    technologies = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des technologies utilisées dans le projet"
    )
    
    # URLs optionnelles du projet
    demo_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL de démonstration du projet"
    )
    github_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL du repository GitHub"
    )
    
    def save(self, *args, **kwargs):
        """
        Override save pour générer automatiquement l'URL de l'image
        """
        super().save(*args, **kwargs)
        
        # Générer l'URL de l'image
        if self.image:
            if hasattr(settings, 'SITE_URL'):
                self.image_url = f"{settings.SITE_URL}{self.image.url}"
            else:
                self.image_url = self.image.url
        
        # Sauvegarder à nouveau si l'URL a changé
        if self.pk and self.image:
            Project.objects.filter(pk=self.pk).update(image_url=self.image_url)

    def delete(self, *args, **kwargs):
        """Surcharge la méthode delete pour supprimer le fichier image"""
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

    @property
    def technologies_list(self):
        """Retourne la liste des technologies"""
        return self.technologies if isinstance(self.technologies, list) else []

    @property
    def technologies_string(self):
        """Retourne les technologies comme string séparées par des virgules"""
        return ", ".join(self.technologies_list) if self.technologies_list else ""

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]