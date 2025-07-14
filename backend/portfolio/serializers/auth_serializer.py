from rest_framework import serializers
from django.contrib.auth import authenticate
from portfolio.models import User, PasswordResetToken
import os

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              username=email, password=password)
            if not user:
                raise serializers.ValidationError('Email ou mot de passe incorrect.')
            if not user.is_active:
                raise serializers.ValidationError('Compte utilisateur désactivé.')
        else:
            raise serializers.ValidationError('Email et mot de passe requis.')

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    # Champs pour l'upload
    profile_image_file = serializers.ImageField(source='profile_image', write_only=True, required=False)
    banner_file = serializers.ImageField(source='banner', write_only=True, required=False)
    
    # URLs en lecture seule
    profile_image_url = serializers.URLField(read_only=True)
    banner_url = serializers.URLField(read_only=True)
    
    # Informations supplémentaires
    full_name = serializers.CharField(read_only=True)
    full_address = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'bio', 'brief_description',
            'profile_image_file', 'profile_image_url', 'banner_file', 'banner_url',
            'country', 'city', 'postal_code', 'street', 'house_number', 'phone_number',
            'is_verified', 'full_name', 'full_address', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'profile_image_url', 'banner_url', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        """
        Mettre à jour un utilisateur avec gestion des images
        """
        # Gérer la suppression de l'ancienne image de profil
        if 'profile_image' in validated_data and instance.profile_image:
            old_profile_image = instance.profile_image
            if old_profile_image and os.path.isfile(old_profile_image.path):
                os.remove(old_profile_image.path)
        
        # Gérer la suppression de l'ancienne bannière
        if 'banner' in validated_data and instance.banner:
            old_banner = instance.banner
            if old_banner and os.path.isfile(old_banner.path):
                os.remove(old_banner.path)
        
        return super().update(instance, validated_data)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Aucun utilisateur trouvé avec cet email.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8)
    password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs