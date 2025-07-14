from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from ..models.social import Social
from ..models.user import User
from ..serializers.social_serializer import SocialSerializer

class SocialViewSet(viewsets.ModelViewSet):
    serializer_class = SocialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retourne tous les réseaux sociaux pour les admins, 
        ou seulement les réseaux sociaux de l'utilisateur connecté
        Inclut automatiquement le SocialType associé
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Social.objects.select_related('social_type', 'user').all()
        return Social.objects.select_related('social_type', 'user').filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement le réseau social à l'utilisateur connecté"""
        serializer.save(user=self.request.user)
        
    def get_permissions(self):
        """
        Définir des permissions spécifiques selon l'action
        """
        if self.action == 'socials_by_user':
            # Accès public pour consulter les formations d'un utilisateur
            permission_classes = [AllowAny]
        else:
            # Authentification requise pour toutes les autres actions
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def socials_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les réseaux sociaux d'un utilisateur spécifique
        URL: /api/socials/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        socials = Social.objects.select_related('social_type', 'user').filter(user=user)
        serializer = self.get_serializer(socials, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-socials')
    def my_socials(self, request):
        """
        Endpoint pour récupérer les réseaux sociaux de l'utilisateur connecté
        URL: /api/socials/my-socials/
        """
        socials = Social.objects.select_related('social_type', 'user').filter(user=request.user)
        serializer = self.get_serializer(socials, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-type/(?P<social_type_id>[^/.]+)')
    def socials_by_type(self, request, social_type_id=None):
        """
        Endpoint pour récupérer les réseaux sociaux par type pour l'utilisateur connecté
        URL: /api/socials/by-type/{social_type_id}/
        """
        socials = Social.objects.select_related('social_type', 'user').filter(
            user=request.user, 
            social_type_id=social_type_id
        )
        serializer = self.get_serializer(socials, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='grouped-by-type')
    def grouped_by_type(self, request):
        """
        Endpoint pour récupérer les réseaux sociaux groupés par type
        URL: /api/socials/grouped-by-type/
        """
        socials = Social.objects.select_related('social_type', 'user').filter(user=request.user)
        
        # Grouper par type de réseau social
        grouped = {}
        for social in socials:
            social_type_label = social.social_type.label
            if social_type_label not in grouped:
                grouped[social_type_label] = []
            grouped[social_type_label].append(self.get_serializer(social).data)
        
        return Response(grouped)