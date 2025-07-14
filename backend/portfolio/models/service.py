from django.db import models
from .base import TimeStampedModel
from .user import User
import os
import uuid
from django.conf import settings

def service_icon_upload_path(instance, filename):
    """
    Fonction pour définir le chemin d'upload des icônes de service
    """
    ext = filename.split('.')[-1]
    filename = f"service_{instance.user.username}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('services', 'icons', filename)

"""
Model Service
"""
class Service(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Icône avec upload et URL
    icon = models.ImageField(
        upload_to=service_icon_upload_path,
        null=True,
        blank=True,
        help_text="Icône du service (formats supportés: PNG, JPG, JPEG, WebP, SVG)"
    )
    icon_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL de l'icône (généré automatiquement après upload ou URL externe)"
    )
    
    # Prix du service (optionnel)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Prix du service en euros"
    )
    
    # Durée estimée (en heures)
    duration_hours = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Durée estimée en heures"
    )
    
    # Disponibilité du service
    is_active = models.BooleanField(
        default=True,
        help_text="Service disponible à la commande"
    )
    
    # Tags pour catégoriser les services
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Tags pour catégoriser le service (ex: ['web', 'design', 'mobile'])"
    )

    def save(self, *args, **kwargs):
        """
        Override save pour générer automatiquement l'URL de l'icône
        """
        super().save(*args, **kwargs)
        
        # Générer l'URL de l'icône
        if self.icon:
            if hasattr(settings, 'SITE_URL'):
                self.icon_url = f"{settings.SITE_URL}{self.icon.url}"
            else:
                self.icon_url = self.icon.url
        
        # Sauvegarder à nouveau si l'URL a changé
        if self.pk and self.icon:
            Service.objects.filter(pk=self.pk).update(icon_url=self.icon_url)

    def delete(self, *args, **kwargs):
        """Surcharge la méthode delete pour supprimer le fichier icône"""
        if self.icon:
            if os.path.isfile(self.icon.path):
                os.remove(self.icon.path)
        super().delete(*args, **kwargs)

    @property
    def tags_list(self):
        """Retourne la liste des tags"""
        return self.tags if isinstance(self.tags, list) else []

    @property
    def tags_string(self):
        """Retourne les tags comme string séparés par des virgules"""
        return ", ".join(self.tags_list) if self.tags_list else ""

    @property
    def price_display(self):
        """Retourne le prix formaté"""
        if self.price:
            return f"{self.price}€"
        return "Prix sur demande"

    @property
    def duration_display(self):
        """Retourne la durée formatée"""
        if self.duration_hours:
            if self.duration_hours == 1:
                return "1 heure"
            elif self.duration_hours < 24:
                return f"{self.duration_hours} heures"
            else:
                days = self.duration_hours // 24
                remaining_hours = self.duration_hours % 24
                if remaining_hours == 0:
                    return f"{days} jour{'s' if days > 1 else ''}"
                else:
                    return f"{days} jour{'s' if days > 1 else ''} et {remaining_hours} heure{'s' if remaining_hours > 1 else ''}"
        return "Durée non spécifiée"

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['created_at']),
        ]