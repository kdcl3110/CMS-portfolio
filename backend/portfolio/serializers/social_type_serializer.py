from rest_framework import serializers
from portfolio.models.social_type import SocialType

class SocialTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialType
        fields = '__all__'