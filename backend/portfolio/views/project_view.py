from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from PIL import Image
import os
import tempfile
from ..models.project import Project
from ..models.user import User
from ..serializers.project_serializer import ProjectSerializer

def validate_project_image(file):
    """
    Valide le fichier image uploadé avec debug détaillé
    """
    print(f"=== VALIDATION IMAGE DEBUG ===")
    print(f"File object type: {type(file)}")
    print(f"File name: {getattr(file, 'name', 'NO NAME')}")
    print(f"File size: {getattr(file, 'size', 'NO SIZE')}")
    print(f"File content_type: {getattr(file, 'content_type', 'NO CONTENT_TYPE')}")
    
    # Vérifier si c'est bien un objet fichier Django
    if not hasattr(file, 'read'):
        raise ValueError(f"L'objet n'est pas un fichier valide: {type(file)}")
    
    # Vérifier la taille du fichier (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if hasattr(file, 'size') and file.size > max_size:
        raise ValueError("Le fichier est trop volumineux. Taille maximale: 5MB")
    
    # Vérifier l'extension
    if hasattr(file, 'name') and file.name:
        allowed_extensions = ['jpg', 'jpeg', 'png', 'webp']
        file_extension = file.name.split('.')[-1].lower()
        print(f"Extension détectée: {file_extension}")
        if file_extension not in allowed_extensions:
            raise ValueError(f"Format de fichier non supporté. Formats acceptés: {', '.join(allowed_extensions)}")
    
    # Vérifier que c'est vraiment une image avec PIL
    try:
        print("Tentative d'ouverture avec PIL...")
        # Sauvegarder temporairement pour debugger
        file.seek(0)  # Retour au début du fichier
        image = Image.open(file)
        print(f"Image PIL ouverte: format={image.format}, mode={image.mode}, size={image.size}")
        
        # Vérifier l'image
        image.verify()
        print("✅ Image PIL vérifiée avec succès")
        
        # Remettre le pointeur au début pour utilisation ultérieure
        file.seek(0)
        
    except Exception as e:
        print(f"❌ Erreur PIL: {str(e)}")
        print(f"Type d'erreur: {type(e)}")
        
        # Essayer de créer un fichier temporaire pour debug
        try:
            file.seek(0)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.tmp') as temp_file:
                temp_file.write(file.read())
                temp_path = temp_file.name
            
            print(f"Fichier temporaire créé: {temp_path}")
            
            # Essayer d'ouvrir le fichier temporaire
            with Image.open(temp_path) as temp_image:
                print(f"Fichier temporaire ouvert: {temp_image.format}, {temp_image.size}")
            
            # Nettoyer
            os.unlink(temp_path)
            file.seek(0)
            
        except Exception as temp_error:
            print(f"❌ Erreur fichier temporaire: {str(temp_error)}")
            raise ValueError(f"Le fichier n'est pas une image valide: {str(e)}")
    
    return True

def remove_old_file(file_field):
    """
    Supprime un ancien fichier s'il existe
    """
    if file_field and hasattr(file_field, 'path') and os.path.isfile(file_field.path):
        try:
            os.remove(file_field.path)
        except OSError:
            pass

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """
        Retourne tous les projets pour les admins, 
        ou seulement les projets de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Project.objects.select_related('user').all()
        return Project.objects.select_related('user').filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement le projet à l'utilisateur connecté"""
        serializer.save(user=self.request.user)
        
    def get_permissions(self):
        """
        Définir des permissions spécifiques selon l'action
        """
        if self.action == 'projects_by_user':
            # Accès public pour consulter les formations d'un utilisateur
            permission_classes = [AllowAny]
        else:
            # Authentification requise pour toutes les autres actions
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Override create pour gérer l'upload d'image"""
        # Validation de l'image si présente
        if 'image_file' in request.FILES:
            try:
                validate_project_image(request.FILES['image_file'])
            except ValueError as e:
                return Response({
                    'error': f'Erreur image: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Override update pour gérer l'upload d'image"""
        # Validation de l'image si présente
        if 'image_file' in request.FILES:
            try:
                validate_project_image(request.FILES['image_file'])
            except ValueError as e:
                return Response({
                    'error': f'Erreur image: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def projects_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les projets d'un utilisateur spécifique
        URL: /api/projects/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        projects = Project.objects.select_related('user').filter(user=user)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-projects')
    def my_projects(self, request):
        """
        Endpoint pour récupérer les projets de l'utilisateur connecté
        URL: /api/projects/my-projects/
        """
        projects = Project.objects.select_related('user').filter(user=request.user)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-status/(?P<status_name>[^/.]+)')
    def projects_by_status(self, request, status_name=None):
        """
        Endpoint pour récupérer les projets par statut
        URL: /api/projects/by-status/{status_name}/
        """
        valid_statuses = ['draft', 'in_progress', 'completed', 'archived']
        if status_name not in valid_statuses:
            return Response(
                {'error': f'Statut invalide. Statuts valides: {", ".join(valid_statuses)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        projects = Project.objects.select_related('user').filter(
            user=request.user, 
            status=status_name
        )
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='published')
    def published_projects(self, request):
        """
        Endpoint pour récupérer les projets publiés (completed)
        URL: /api/projects/published/
        """
        projects = Project.objects.select_related('user').filter(
            user=request.user, 
            status='completed'
        )
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        """
        Endpoint spécifique pour uploader l'image d'un projet
        URL: /api/projects/{id}/upload_image/
        """
        project = self.get_object()
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Aucun fichier image fourni'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Valider le fichier
        try:
            validate_project_image(request.FILES['image'])
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Supprimer l'ancienne image
        remove_old_file(project.image)

        # Assigner la nouvelle image
        project.image = request.FILES['image']
        project.save()

        serializer = self.get_serializer(project)
        return Response({
            'message': 'Image du projet mise à jour avec succès',
            'project': serializer.data
        })

    @action(detail=True, methods=['delete'])
    def remove_image(self, request, pk=None):
        """
        Endpoint pour supprimer l'image d'un projet
        URL: /api/projects/{id}/remove_image/
        """
        project = self.get_object()
        
        if project.image:
            remove_old_file(project.image)
            project.image = None
            project.image_url = None
            project.save()
            
            return Response({
                'message': 'Image du projet supprimée avec succès'
            })
        
        return Response({
            'message': 'Aucune image à supprimer'
        }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def update_order(self, request, pk=None):
        """
        Endpoint pour mettre à jour l'ordre d'un projet
        URL: /api/projects/{id}/update_order/
        """
        project = self.get_object()
        new_order = request.data.get('order')
        
        if new_order is None:
            return Response({
                'error': 'Ordre requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_order = int(new_order)
            if new_order < 0:
                raise ValueError("L'ordre doit être positif")
        except (ValueError, TypeError):
            return Response({
                'error': 'Ordre invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        project.order = new_order
        project.save()
        
        serializer = self.get_serializer(project)
        return Response(serializer.data)