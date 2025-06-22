from rest_framework import viewsets
from portfolio.models.article import Article
from portfolio.serializers.article_serializer import ArticleSerializer
from rest_framework.permissions import IsAuthenticated

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
