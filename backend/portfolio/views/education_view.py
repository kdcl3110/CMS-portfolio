# portfolio/views/education_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models.education import Education
from ..models.user import User
from ..serializers.education_serializer import EducationSerializer

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retourne toutes les formations pour les admins, 
        ou seulement les formations de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Education.objects.all()
        return Education.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement la formation à l'utilisateur connecté"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def educations_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les formations d'un utilisateur spécifique
        URL: /api/educations/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        educations = Education.objects.filter(user=user)
        serializer = self.get_serializer(educations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-educations')
    def my_educations(self, request):
        """
        Endpoint pour récupérer les formations de l'utilisateur connecté
        URL: /api/educations/my-educations/
        """
        educations = Education.objects.filter(user=request.user)
        serializer = self.get_serializer(educations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='current-education')
    def current_education(self, request):
        """
        Endpoint pour récupérer la formation actuelle (sans end_date)
        URL: /api/educations/current-education/
        """
        current_edu = Education.objects.filter(
            user=request.user, 
            end_date__isnull=True
        ).first()
        
        if current_edu:
            serializer = self.get_serializer(current_edu)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'Aucune formation actuelle trouvée'}, 
                status=status.HTTP_404_NOT_FOUND
            )