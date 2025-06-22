from rest_framework import viewsets
from portfolio.models.education import Education
from portfolio.serializers.education_serializer import EducationSerializer
from rest_framework.permissions import IsAuthenticated

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
