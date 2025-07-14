from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from PIL import Image
import tempfile
import os
from ..models.service import Service
from ..models.user import User
from ..serializers.service_serializer import ServiceSerializer

def validate_service_icon(file):
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

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """
        Retourne tous les services pour les admins, 
        ou seulement les services de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Service.objects.select_related('user').all()
        return Service.objects.select_related('user').filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement le service à l'utilisateur connecté"""
        serializer.save(user=self.request.user)
        
    def get_permissions(self):
        """
        Définir des permissions spécifiques selon l'action
        """
        if self.action == 'services_by_user':
            # Accès public pour consulter les formations d'un utilisateur
            permission_classes = [AllowAny]
        else:
            # Authentification requise pour toutes les autres actions
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Override create pour gérer l'upload d'icône"""
        # Validation de l'icône si présente
        if 'icon_file' in request.FILES:
            try:
                validate_service_icon(request.FILES['icon_file'])
            except ValueError as e:
                return Response({
                    'error': f'Erreur icône: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Override update pour gérer l'upload d'icône"""
        # Validation de l'icône si présente
        if 'icon_file' in request.FILES:
            try:
                validate_service_icon(request.FILES['icon_file'])
            except ValueError as e:
                return Response({
                    'error': f'Erreur icône: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def services_by_user(self, request, user_id=None):
        """
        Endpoint pour récupérer les services d'un utilisateur spécifique
        URL: /api/services/user/{user_id}/
        """
        user = get_object_or_404(User, id=user_id)
        
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        services = Service.objects.select_related('user').filter(user=user)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-services')
    def my_services(self, request):
        """
        Endpoint pour récupérer les services de l'utilisateur connecté
        URL: /api/services/my-services/
        """
        services = Service.objects.select_related('user').filter(user=request.user)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='active')
    def active_services(self, request):
        """
        Endpoint pour récupérer les services actifs de l'utilisateur connecté
        URL: /api/services/active/
        """
        services = Service.objects.select_related('user').filter(
            user=request.user, 
            is_active=True
        )
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-tag/(?P<tag_name>[^/.]+)')
    def services_by_tag(self, request, tag_name=None):
        """
        Endpoint pour récupérer les services par tag
        URL: /api/services/by-tag/{tag_name}/
        """
        services = Service.objects.select_related('user').filter(
            user=request.user,
            tags__contains=[tag_name]
        )
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='price-range')
    def services_by_price_range(self, request):
        """
        Endpoint pour récupérer les services par fourchette de prix
        URL: /api/services/price-range/?min_price=100&max_price=500
        """
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        services = Service.objects.select_related('user').filter(user=request.user)
        
        if min_price:
            try:
                min_price = float(min_price)
                services = services.filter(price__gte=min_price)
            except ValueError:
                return Response({
                    'error': 'Prix minimum invalide'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if max_price:
            try:
                max_price = float(max_price)
                services = services.filter(price__lte=max_price)
            except ValueError:
                return Response({
                    'error': 'Prix maximum invalide'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_icon(self, request, pk=None):
        """
        Endpoint spécifique pour uploader l'icône d'un service
        URL: /api/services/{id}/upload_icon/
        """
        service = self.get_object()
        
        if 'icon' not in request.FILES:
            return Response(
                {'error': 'Aucun fichier icône fourni'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Valider le fichier
        try:
            validate_service_icon(request.FILES['icon'])
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Supprimer l'ancienne icône
        remove_old_file(service.icon)

        # Assigner la nouvelle icône
        service.icon = request.FILES['icon']
        service.save()

        serializer = self.get_serializer(service)
        return Response({
            'message': 'Icône du service mise à jour avec succès',
            'service': serializer.data
        })

    @action(detail=True, methods=['delete'])
    def remove_icon(self, request, pk=None):
        """
        Endpoint pour supprimer l'icône d'un service
        URL: /api/services/{id}/remove_icon/
        """
        service = self.get_object()
        
        if service.icon:
            remove_old_file(service.icon)
            service.icon = None
            service.icon_url = None
            service.save()
            
            return Response({
                'message': 'Icône du service supprimée avec succès'
            })
        
        return Response({
            'message': 'Aucune icône à supprimer'
        }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def toggle_active(self, request, pk=None):
        """
        Endpoint pour activer/désactiver un service
        URL: /api/services/{id}/toggle_active/
        """
        service = self.get_object()
        service.is_active = not service.is_active
        service.save()
        
        status_text = "activé" if service.is_active else "désactivé"
        serializer = self.get_serializer(service)
        
        return Response({
            'message': f'Service {status_text} avec succès',
            'service': serializer.data
        })

    @action(detail=True, methods=['patch'])
    def update_order(self, request, pk=None):
        """
        Endpoint pour mettre à jour l'ordre d'un service
        URL: /api/services/{id}/update_order/
        """
        service = self.get_object()
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
        
        service.order = new_order
        service.save()
        
        serializer = self.get_serializer(service)
        return Response(serializer.data)
