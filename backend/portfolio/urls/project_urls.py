from rest_framework.routers import DefaultRouter
from portfolio.views.project_view import ProjectViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

urlpatterns = router.urls
