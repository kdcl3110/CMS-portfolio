from rest_framework import viewsets
from portfolio.models.settings import Settings
from portfolio.serializers.settings_serializer import SettingsSerializer
from rest_framework.permissions import IsAuthenticated

class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [IsAuthenticated]