from rest_framework import serializers
from portfolio.models.article import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'