from rest_framework.routers import DefaultRouter
from portfolio.views.service_view import ServiceViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')

urlpatterns = router.urls