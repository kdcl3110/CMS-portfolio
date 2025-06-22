from rest_framework.routers import DefaultRouter
from portfolio.views.user_view import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user') 

urlpatterns = router.urls