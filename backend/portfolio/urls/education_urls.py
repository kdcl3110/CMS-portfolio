from rest_framework.routers import DefaultRouter
from portfolio.views.education_view import EducationViewSet 

router = DefaultRouter()
router.register(r'educations', EducationViewSet, basename='education') 

urlpatterns = router.urls