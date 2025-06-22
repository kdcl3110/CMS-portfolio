from rest_framework.routers import DefaultRouter
from portfolio.views.contact_view import ContactViewSet

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact') 

urlpatterns = router.urls