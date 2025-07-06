from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models.experience import Experience
from ..models.user import User
from ..serializers.experience_serializer import ExperienceSerializer

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retourne toutes les expériences pour les admins, 
        ou seulement les expériences de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Experience.objects.all()
        return Experience.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement l'expérience à l'utilisateur connecté"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def experiences_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les expériences d'un utilisateur spécifique
        URL: /api/experiences/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        experiences = Experience.objects.filter(user=user)
        serializer = self.get_serializer(experiences, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-experiences')
    def my_experiences(self, request):
        """
        Endpoint pour récupérer les expériences de l'utilisateur connecté
        URL: /api/experiences/my-experiences/
        """
        experiences = Experience.objects.filter(user=request.user)
        serializer = self.get_serializer(experiences, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='current-experience')
    def current_experience(self, request):
        """
        Endpoint pour récupérer l'expérience actuelle (sans end_date)
        URL: /api/experiences/current-experience/
        """
        current_exp = Experience.objects.filter(
            user=request.user, 
            end_date__isnull=True
        ).first()
        
        if current_exp:
            serializer = self.get_serializer(current_exp)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'Aucune expérience actuelle trouvée'}, 
                status=status.HTTP_404_NOT_FOUND
            )
