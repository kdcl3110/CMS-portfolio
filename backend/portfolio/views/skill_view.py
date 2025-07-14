from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from ..models.skill import Skill
from ..models.user import User
from ..serializers.skill_serializer import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retourne toutes les skills pour les admins, 
        ou seulement les skills de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Skill.objects.all()
        return Skill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement la skill à l'utilisateur connecté"""
        serializer.save(user=self.request.user)
        
    def get_permissions(self):
        """
        Définir des permissions spécifiques selon l'action
        """
        if self.action == 'skills_by_user':
            # Accès public pour consulter les formations d'un utilisateur
            permission_classes = [AllowAny]
        else:
            # Authentification requise pour toutes les autres actions
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def skills_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les skills d'un utilisateur spécifique
        URL: /api/skills/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        skills = Skill.objects.filter(user=user)
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-skills')
    def my_skills(self, request):
        """
        Endpoint pour récupérer les skills de l'utilisateur connecté
        URL: /api/skills/my-skills/
        """
        skills = Skill.objects.filter(user=request.user)
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)