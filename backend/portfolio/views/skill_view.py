from rest_framework import viewsets
from portfolio.models.skill import Skill
from portfolio.serializers.skill_serializer import SkillSerializer
from rest_framework.permissions import IsAuthenticated

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]