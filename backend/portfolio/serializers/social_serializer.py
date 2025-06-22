
from rest_framework import serializers
from portfolio.models.social import Social

class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social
        fields = '__all__'