from rest_framework.routers import DefaultRouter
from portfolio.views.category_view import CategoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category') 

urlpatterns = router.urls