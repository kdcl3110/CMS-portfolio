from django.db import models
from .base import TimeStampedModel
import os
from django.conf import settings

def social_type_logo_upload_path(instance, filename):
    """
    Fonction pour définir le chemin d'upload des logos
    """
    # Obtenir l'extension du fichier
    ext = filename.split('.')[-1]
    # Créer un nom de fichier basé sur le label du social type
    filename = f"{instance.label.lower().replace(' ', '_')}_logo.{ext}"
    # Retourner le chemin complet
    return os.path.join('social_types', 'logos', filename)

"""
Model SocialType
"""
class SocialType(TimeStampedModel):
    logo = models.ImageField(
        upload_to=social_type_logo_upload_path,
        null=True,
        blank=True,
        help_text="Logo du réseau social (formats supportés: PNG, JPG, JPEG, SVG)"
    )
    logo_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL du logo (généré automatiquement après upload ou URL externe)"
    )
    label = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.label

    def save(self, *args, **kwargs):
        """
        Override save pour générer automatiquement l'URL du logo
        """
        super().save(*args, **kwargs)
        
        # Si un logo a été uploadé, générer l'URL complète
        if self.logo:
            # Construire l'URL complète
            if hasattr(settings, 'SITE_URL'):
                self.logo_url = f"{settings.SITE_URL}{self.logo.url}"
            else:
                # Fallback si SITE_URL n'est pas défini
                self.logo_url = self.logo.url
            
            # Sauvegarder à nouveau si l'URL a changé
            if self.pk:  # Éviter la récursion infinie
                SocialType.objects.filter(pk=self.pk).update(logo_url=self.logo_url)

    def delete(self, *args, **kwargs):
        """
        Override delete pour supprimer le fichier logo du disque
        """
        if self.logo:
            # Supprimer le fichier physique
            if os.path.isfile(self.logo.path):
                os.remove(self.logo.path)
        super().delete(*args, **kwargs)
    
    class Meta:
        verbose_name = "Social Type"
        verbose_name_plural = "Social Types"
        ordering = ['-created_at']
