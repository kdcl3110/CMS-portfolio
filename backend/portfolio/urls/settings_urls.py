from rest_framework.routers import DefaultRouter
from portfolio.views.settings_view import SettingsViewSet

router = DefaultRouter()
router.register(r'settings', SettingsViewSet, basename='setting') 

urlpatterns = router.urls