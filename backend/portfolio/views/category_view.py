from rest_framework import viewsets
from portfolio.models.category import Category
from portfolio.serializers.category_serializer import CategorySerializer
from rest_framework.permissions import IsAuthenticated

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
