from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import os
from PIL import Image
import tempfile
from portfolio.models import User, PasswordResetToken
from portfolio.serializers.auth_serializer import (
    UserRegistrationSerializer,
    UserLoginSerializer, 
    PasswordResetSerializer, 
    PasswordResetConfirmSerializer, 
    UserProfileSerializer
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def validate_image_file_debug(file):
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
            pass  # Le fichier n'existe peut-être plus


class UpdateProfilView(APIView):
    """
    Endpoint UNIFIÉ pour toutes les modifications de profil
    Gère: données texte, upload d'images, suppression d'images
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        """
        Mise à jour complète du profil avec gestion des images
        """
        return self._update_profile(request)

    def patch(self, request):
        """
        Mise à jour partielle du profil avec gestion des images
        """
        return self._update_profile(request)

    def _update_profile(self, request):
        """
        Logique principale de mise à jour du profil avec debug
        """
        user = request.user
        
        print("=== DEBUG UPDATE PROFILE ===")
        print(f"User: {user.email}")
        print(f"Request FILES keys: {list(request.FILES.keys())}")
        print(f"Request data keys: {list(request.data.keys())}")
        
        # ========================
        # 1. GESTION DES IMAGES
        # ========================
        
        # Debug des fichiers reçus
        if request.FILES:
            for key, file in request.FILES.items():
                print(f"Fichier reçu - {key}: {file.name} ({file.size} bytes)")
        
        # Validation des nouvelles images
        if 'profile_image_file' in request.FILES:
            try:
                print("🔍 Validation de profile_image_file...")
                validate_image_file_debug(request.FILES['profile_image_file'])
                print("✅ profile_image_file validé")
            except ValueError as e:
                print(f"❌ Erreur validation profile_image_file: {str(e)}")
                return Response({
                    'error': f'Erreur image de profil: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if 'banner_file' in request.FILES:
            try:
                print("🔍 Validation de banner_file...")
                validate_image_file_debug(request.FILES['banner_file'])
                print("✅ banner_file validé")
            except ValueError as e:
                print(f"❌ Erreur validation banner_file: {str(e)}")
                return Response({
                    'error': f'Erreur bannière: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Gestion suppression d'images (via paramètres booléens)
        delete_profile_image = request.data.get('delete_profile_image', '').lower() == 'true'
        delete_banner = request.data.get('delete_banner', '').lower() == 'true'
        
        print(f"Delete profile image: {delete_profile_image}")
        print(f"Delete banner: {delete_banner}")
        
        # ========================
        # 2. SUPPRESSION ANCIENNES IMAGES
        # ========================
        
        if delete_profile_image and user.profile_image:
            remove_old_file(user.profile_image)
            user.profile_image = None
            user.profile_image_url = None
        
        if delete_banner and user.banner:
            remove_old_file(user.banner)
            user.banner = None
            user.banner_url = None
        
        # Supprimer les anciennes images si de nouvelles sont uploadées
        if 'profile_image_file' in request.FILES and user.profile_image:
            remove_old_file(user.profile_image)
        
        if 'banner_file' in request.FILES and user.banner:
            remove_old_file(user.banner)
        
        # ========================
        # 3. MISE À JOUR VIA SERIALIZER
        # ========================
        
        print("🔄 Création du serializer...")
        serializer = UserProfileSerializer(
            user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        print(f"Serializer data keys: {list(request.data.keys())}")
        
        if serializer.is_valid():
            print("✅ Serializer valide")
            # Sauvegarder les modifications
            updated_user = serializer.save()
            print("✅ User sauvegardé")
            
            # ========================
            # 4. RESPONSE AVEC DÉTAILS
            # ========================
            
            # Déterminer les actions effectuées
            actions_performed = []
            
            if 'profile_image_file' in request.FILES:
                actions_performed.append('Image de profil mise à jour')
            
            if 'banner_file' in request.FILES:
                actions_performed.append('Bannière mise à jour')
            
            if delete_profile_image:
                actions_performed.append('Image de profil supprimée')
            
            if delete_banner:
                actions_performed.append('Bannière supprimée')
            
            # Vérifier si des données texte ont été modifiées
            text_fields = ['first_name', 'last_name', 'bio', 'country', 'city', 
                          'postal_code', 'street', 'house_number', 'phone_number']
            
            for field in text_fields:
                if field in request.data:
                    actions_performed.append('Informations personnelles mises à jour')
                    break
            
            if not actions_performed:
                actions_performed.append('Profil actualisé')
            
            return Response({
                'message': 'Profil mis à jour avec succès',
                'actions': actions_performed,
                'user': UserProfileSerializer(updated_user).data
            }, status=status.HTTP_200_OK)
        
        else:
            print("❌ Erreurs de validation du serializer:")
            for field, errors in serializer.errors.items():
                print(f"  {field}: {errors}")
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Autres vues restent identiques...
class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Utilisateur créé avec succès',
                'user': UserProfileSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Connexion réussie',
                'user': UserProfileSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)



class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            try:
                reset_token = PasswordResetToken.objects.get(
                    token=token,
                    is_used=False,
                    created_at__gte=timezone.now() - timedelta(hours=24)
                )
                
                user = reset_token.user
                user.set_password(password)
                user.save()
                
                reset_token.is_used = True
                reset_token.save()
                
                return Response({
                    'message': 'Mot de passe réinitialisé avec succès'
                }, status=status.HTTP_200_OK)
                
            except PasswordResetToken.DoesNotExist:
                return Response({
                    'error': 'Token invalide ou expiré'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Supprimer les anciens tokens
            PasswordResetToken.objects.filter(user=user).delete()
            
            # Créer un nouveau token
            reset_token = PasswordResetToken.objects.create(user=user)
            
            # Envoyer l'email
            reset_url = f"http://localhost:3000/reset-password/{reset_token.token}"
            send_mail(
                'Réinitialisation de mot de passe',
                f'Cliquez sur ce lien pour réinitialiser votre mot de passe: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({
                'message': 'Email de réinitialisation envoyé'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
