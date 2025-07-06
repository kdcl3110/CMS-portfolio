from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from ..models.social_type import SocialType
from ..serializers.social_type_serializer import SocialTypeSerializer

class SocialTypeViewSet(viewsets.ModelViewSet):
    queryset = SocialType.objects.all()
    serializer_class = SocialTypeSerializer
    parser_classes = [MultiPartParser, FormParser]  # Pour gérer les uploads de fichiers

    def get_permissions(self):
        """
        Définir les permissions selon l'action
        """
        if self.action in ['list', 'retrieve']:
            # Lecture accessible à tous les utilisateurs authentifiés
            permission_classes = [IsAuthenticated]
        else:
            # Création, modification, suppression réservées aux admins
            permission_classes = [IsAdminUser]
        
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_logo(self, request, pk=None):
        """
        Endpoint spécifique pour uploader un logo
        URL: /api/social-types/{id}/upload_logo/
        """
        social_type = self.get_object()
        
        if 'logo' not in request.FILES:
            return Response(
                {'error': 'Aucun fichier logo fourni'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Supprimer l'ancien logo si il existe
        if social_type.logo:
            old_logo = social_type.logo
            if old_logo and os.path.isfile(old_logo.path):
                os.remove(old_logo.path)

        # Assigner le nouveau logo
        social_type.logo = request.FILES['logo']
        social_type.save()

        serializer = self.get_serializer(social_type)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def remove_logo(self, request, pk=None):
        """
        Endpoint pour supprimer le logo
        URL: /api/social-types/{id}/remove_logo/
        """
        social_type = self.get_object()
        
        if social_type.logo:
            # Supprimer le fichier physique
            if os.path.isfile(social_type.logo.path):
                os.remove(social_type.logo.path)
            
            # Vider les champs logo
            social_type.logo = None
            social_type.logo_url = None
            social_type.save()

        serializer = self.get_serializer(social_type)
        return Response(serializer.data)
