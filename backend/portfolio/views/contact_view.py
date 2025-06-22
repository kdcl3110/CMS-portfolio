from rest_framework import viewsets
from portfolio.models.contact import Contact
from portfolio.serializers.contact_serializer import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    
