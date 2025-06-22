from rest_framework.routers import DefaultRouter
from portfolio.views.skill_view import SkillViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skill') 

urlpatterns = router.urls