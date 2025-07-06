from django.db import models
from django.contrib.auth.models import AbstractUser
from .base import TimeStampedModel
import uuid
import os
from django.conf import settings

def user_profile_image_upload_path(instance, filename):
    """
    Fonction pour définir le chemin d'upload des images de profil
    """
    ext = filename.split('.')[-1]
    filename = f"profile_{instance.username}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('users', 'profiles', filename)

def user_banner_upload_path(instance, filename):
    """
    Fonction pour définir le chemin d'upload des banners
    """
    ext = filename.split('.')[-1]
    filename = f"banner_{instance.username}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('users', 'banners', filename)

"""
Models User
"""
class User(AbstractUser):
    # Redéfinir email pour le rendre unique (AbstractUser ne l'a pas par défaut)
    email = models.EmailField(unique=True)
    
    # Vos champs personnalisés
    bio = models.TextField(blank=True)
    
    # Images avec upload et URL
    profile_image = models.ImageField(
        upload_to=user_profile_image_upload_path,
        null=True,
        blank=True,
        help_text="Image de profil (formats supportés: PNG, JPG, JPEG, WebP)"
    )
    profile_image_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL de l'image de profil (généré automatiquement après upload ou URL externe)"
    )
    
    banner = models.ImageField(
        upload_to=user_banner_upload_path,
        null=True,
        blank=True,
        help_text="Image de bannière (formats supportés: PNG, JPG, JPEG, WebP)"
    )
    banner_url = models.URLField(
        null=True,
        blank=True,
        help_text="URL de la bannière (généré automatiquement après upload ou URL externe)"
    )
    
    is_verified = models.BooleanField(default=True)
    
    # Adresse
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    street = models.CharField(max_length=200, blank=True)
    house_number = models.CharField(max_length=10, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Timestamps (pas besoin de redéfinir, AbstractUser les a déjà via date_joined)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        """
        Override save pour générer automatiquement les URLs des images
        """
        super().save(*args, **kwargs)
        
        # Générer l'URL de l'image de profil
        if self.profile_image:
            if hasattr(settings, 'SITE_URL'):
                self.profile_image_url = f"{settings.SITE_URL}{self.profile_image.url}"
            else:
                self.profile_image_url = self.profile_image.url
        
        # Générer l'URL de la bannière
        if self.banner:
            if hasattr(settings, 'SITE_URL'):
                self.banner_url = f"{settings.SITE_URL}{self.banner.url}"
            else:
                self.banner_url = self.banner.url
        
        # Sauvegarder à nouveau si les URLs ont changé
        if self.pk and (self.profile_image or self.banner):
            User.objects.filter(pk=self.pk).update(
                profile_image_url=self.profile_image_url,
                banner_url=self.banner_url
            )

    def delete(self, *args, **kwargs):
        """Surcharge la méthode delete pour gérer les contraintes et supprimer les fichiers"""
        from django.contrib.admin.models import LogEntry
        
        # Supprimer les fichiers images
        if self.profile_image:
            if os.path.isfile(self.profile_image.path):
                os.remove(self.profile_image.path)
        
        if self.banner:
            if os.path.isfile(self.banner.path):
                os.remove(self.banner.path)
        
        # Supprimer d'abord les logs admin liés à cet utilisateur
        LogEntry.objects.filter(user=self).delete()
        
        # Appeler la méthode delete parente
        super().delete(*args, **kwargs)
        
    def __str__(self):
        return f"{self.email}"
    
    @property
    def full_name(self):
        """Retourne le nom complet de l'utilisateur"""
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def full_address(self):
        """Retourne l'adresse complète formatée"""
        address_parts = [
            self.house_number,
            self.street,
            self.postal_code,
            self.city,
            self.country
        ]
        return ", ".join([part for part in address_parts if part])
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['created_at']),
        ]
        

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'password_reset_tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', 'is_used']),
        ]

