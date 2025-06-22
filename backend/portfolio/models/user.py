from django.db import models
from django.contrib.auth.models import AbstractUser
from .base import TimeStampedModel
import uuid

"""
Models User
"""
class User(AbstractUser):
    # Redéfinir email pour le rendre unique (AbstractUser ne l'a pas par défaut)
    email = models.EmailField(unique=True)
    
    # Vos champs personnalisés
    bio = models.TextField(blank=True)
    profile_image = models.URLField(blank=True)
    banner = models.URLField(blank=True)
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

    def delete(self, *args, **kwargs):
        """Surcharge la méthode delete pour gérer les contraintes"""
        from django.contrib.admin.models import LogEntry
        
        # Supprimer d'abord les logs admin liés à cet utilisateur
        LogEntry.objects.filter(user=self).delete()
        
        # Supprimer les autres relations si nécessaire
        # Exemple : si vous avez d'autres modèles avec des FK vers User
        # self.mon_autre_model_set.all().delete()
        
        # Appeler la méthode delete parente
        super().delete(*args, **kwargs)
        
    def __str__(self):
        return f"{self.email}"  # Plus logique avec EMAIL comme USERNAME_FIELD
    
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