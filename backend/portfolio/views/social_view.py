from rest_framework import viewsets
from portfolio.models.social import Social
from portfolio.serializers.social_serializer import SocialSerializer
from rest_framework.permissions import IsAuthenticated

class SocialViewSet(viewsets.ModelViewSet):
    queryset = Social.objects.all()
    serializer_class = SocialSerializer
    permission_classes = [IsAuthenticated]