from rest_framework import serializers
from ..models.education import Education

class EducationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    is_current = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Education
        fields = [
            'id', 'user', 'user_name', 'title', 'start_date', 'end_date', 
            'description', 'school', 'is_current', 'duration', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_is_current(self, obj):
        """Indique si c'est la formation actuelle"""
        return obj.end_date is None

    def get_duration(self, obj):
        """Calcule la durée de la formation"""
        from datetime import date
        start = obj.start_date
        end = obj.end_date or date.today()
        
        years = end.year - start.year
        months = end.month - start.month
        
        if months < 0:
            years -= 1
            months += 12
            
        if years > 0 and months > 0:
            return f"{years} an{'s' if years > 1 else ''} et {months} mois"
        elif years > 0:
            return f"{years} an{'s' if years > 1 else ''}"
        else:
            return f"{months} mois"