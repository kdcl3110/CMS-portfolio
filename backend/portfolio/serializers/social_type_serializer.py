from rest_framework import serializers
from ..models.social_type import SocialType
import os

class SocialTypeSerializer(serializers.ModelSerializer):
    logo_file = serializers.ImageField(source='logo', write_only=True, required=False)
    logo_url = serializers.URLField(read_only=True)
    
    class Meta:
        model = SocialType
        fields = ['id', 'label', 'logo_file', 'logo_url', 'created_at', 'updated_at']
        read_only_fields = ['logo_url', 'created_at', 'updated_at']

    def create(self, validated_data):
        """
        Créer un SocialType avec gestion du logo
        """
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Mettre à jour un SocialType avec gestion du logo
        """
        # Si un nouveau logo est fourni, supprimer l'ancien
        if 'logo' in validated_data and instance.logo:
            old_logo = instance.logo
            if old_logo and os.path.isfile(old_logo.path):
                os.remove(old_logo.path)
        
        return super().update(instance, validated_data)