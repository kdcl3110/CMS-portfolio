from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models.contact import Contact
from ..models.user import User
from ..serializers.contact_serializer import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    
    def get_queryset(self):
        """
        Retourne tous les contacts pour les admins, 
        ou seulement les contacts de l'utilisateur connecté
        """
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Contact.objects.all()
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement le contact à l'utilisateur connecté"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def contacts_by_user(self, request, user_id=None):
        """
        Endpoint personnalisé pour récupérer les contacts d'un utilisateur spécifique
        URL: /api/contacts/user/{user_id}/
        """
        # Vérifier que l'utilisateur existe
        user = get_object_or_404(User, id=user_id)
        
        # Vérifier les permissions (seulement l'utilisateur lui-même ou un admin)
        if not (request.user == user or request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à ces données'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        contacts = Contact.objects.filter(user=user)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-contacts')
    def my_contacts(self, request):
        """
        Endpoint pour récupérer les contacts de l'utilisateur connecté
        URL: /api/contacts/my-contacts/
        """
        contacts = Contact.objects.filter(user=request.user)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        """
        Marquer un contact comme lu
        URL: /api/contacts/{id}/mark_as_read/
        """
        contact = self.get_object()
        contact.read = True
        contact.save()
        serializer = self.get_serializer(contact)
        return Response(serializer.data)