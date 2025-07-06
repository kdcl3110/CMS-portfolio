from rest_framework import serializers
from ..models.skill import Skill

class SkillSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Skill
        fields = ['id', 'user', 'user_name', 'label', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']