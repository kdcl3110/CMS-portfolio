from rest_framework import serializers
from ..models.social import Social
from .social_type_serializer import SocialTypeSerializer

class SocialSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    social_type_detail = SocialTypeSerializer(source='social_type', read_only=True)
    social_type_name = serializers.CharField(source='social_type.label', read_only=True)
    social_type_logo = serializers.URLField(source='social_type.logo_url', read_only=True)
    
    class Meta:
        model = Social
        fields = [
            'id', 'user', 'user_name', 'social_type', 'social_type_detail', 
            'social_type_name', 'social_type_logo', 'link', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """Personnaliser la représentation pour inclure les détails du social type avec logo"""
        data = super().to_representation(instance)
        
        # Structure plus plate avec toutes les infos du social type
        if instance.social_type:
            data['social_type_info'] = {
                'id': instance.social_type.id,
                'label': instance.social_type.label,
                'logo_url': instance.social_type.logo_url,
                'logo': instance.social_type.logo.url if instance.social_type.logo else None,
            }
        
        return data
