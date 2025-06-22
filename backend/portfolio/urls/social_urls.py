from rest_framework.routers import DefaultRouter
from portfolio.views.social_view import SocialViewSet

router = DefaultRouter()
router.register(r'socials', SocialViewSet, basename='social') 

urlpatterns = router.urls