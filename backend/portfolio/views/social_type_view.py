from rest_framework import viewsets
from portfolio.models.social_type import SocialType
from portfolio.serializers.social_type_serializer import SocialTypeSerializer
from rest_framework.permissions import IsAuthenticated

class SocialTypeViewSet(viewsets.ModelViewSet):
    queryset = SocialType.objects.all()
    serializer_class = SocialTypeSerializer
    permission_classes = [IsAuthenticated]