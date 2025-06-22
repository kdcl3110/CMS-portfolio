from rest_framework.routers import DefaultRouter
from portfolio.views.social_type_view import SocialTypeViewSet

router = DefaultRouter()
router.register(r'social_types', SocialTypeViewSet, basename='social_type') 

urlpatterns = router.urls