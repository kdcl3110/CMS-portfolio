from rest_framework import serializers
from ..models.service import Service
import os

class ServiceSerializer(serializers.ModelSerializer):
    # Champs pour l'upload
    icon_file = serializers.ImageField(source='icon', write_only=True, required=False)
    
    # URLs et informations en lecture seule
    icon_url = serializers.URLField(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    tags_string = serializers.CharField(read_only=True)
    price_display = serializers.CharField(read_only=True)
    duration_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'user', 'user_name', 'title', 'description',
            'icon_file', 'icon_url', 'price', 'price_display',
            'duration_hours', 'duration_display', 'is_active',
            'tags', 'tags_string', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_tags(self, value):
        """Valide que tags est une liste"""
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Tags doit être une liste")
        return value

    def validate_price(self, value):
        """Valide que le prix est positif"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Le prix doit être positif")
        return value

    def validate_duration_hours(self, value):
        """Valide que la durée est positive"""
        if value is not None and value <= 0:
            raise serializers.ValidationError("La durée doit être positive")
        return value

    def validate_order(self, value):
        """Valide que l'ordre est positif"""
        if value < 0:
            raise serializers.ValidationError("L'ordre doit être un nombre positif")
        return value

    def update(self, instance, validated_data):
        """
        Mettre à jour un service avec gestion de l'icône
        """
        # Gérer la suppression de l'ancienne icône
        if 'icon' in validated_data and instance.icon:
            old_icon = instance.icon
            if old_icon and os.path.isfile(old_icon.path):
                os.remove(old_icon.path)
        
        return super().update(instance, validated_data)
