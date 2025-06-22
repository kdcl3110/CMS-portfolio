from rest_framework import serializers
from portfolio.models.settings import Settings

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'