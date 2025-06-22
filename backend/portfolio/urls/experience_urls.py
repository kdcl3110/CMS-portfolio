from rest_framework.routers import DefaultRouter
from portfolio.views.experience_view import ExperienceViewSet

router = DefaultRouter()
router.register(r'experiences', ExperienceViewSet, basename='experience') 

urlpatterns = router.urls