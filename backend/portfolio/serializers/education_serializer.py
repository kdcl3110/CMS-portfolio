from rest_framework import serializers
from portfolio.models.education import Education

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'