from rest_framework import serializers
from ..models.project import Project
import os

class ProjectSerializer(serializers.ModelSerializer):
    # Champs pour l'upload
    image_file = serializers.ImageField(source='image', write_only=True, required=False)
    
    # URLs en lecture seule
    image_url = serializers.URLField(read_only=True)
    
    # Informations utilisateur
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    # Technologies comme liste
    technologies_string = serializers.CharField(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'user', 'user_name', 'title', 'description',
            'image_file', 'image_url', 'technologies', 'technologies_string',
            'demo_url', 'github_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_technologies(self, value):
        """Valide que technologies est une liste"""
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Technologies doit être une liste")
        return value

    def validate_order(self, value):
        """Valide que l'ordre est positif"""
        if value < 0:
            raise serializers.ValidationError("L'ordre doit être un nombre positif")
        return value

    def update(self, instance, validated_data):
        """
        Mettre à jour un projet avec gestion de l'image
        """
        # Gérer la suppression de l'ancienne image
        if 'image' in validated_data and instance.image:
            old_image = instance.image
            if old_image and os.path.isfile(old_image.path):
                os.remove(old_image.path)
        
        return super().update(instance, validated_data)