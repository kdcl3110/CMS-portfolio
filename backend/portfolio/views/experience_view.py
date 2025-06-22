from rest_framework import viewsets
from portfolio.models.experience import Experience
from portfolio.serializers.experience_serializer import ExperienceSerializer
from rest_framework.permissions import IsAuthenticated

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]