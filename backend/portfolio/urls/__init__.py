from django.urls import path, include
from .user_urls import urlpatterns as user_urls
from .settings_urls import urlpatterns as settings_urls
from .social_urls import urlpatterns as social_urls
from .education_urls import urlpatterns as education_urls
from .contact_urls import urlpatterns as contact_urls
from .experience_urls import urlpatterns as experience_urls
from .category_urls import urlpatterns as category_urls
from .article_urls import urlpatterns as article_urls
from .skill_urls import urlpatterns as skill_urls
from .social_type_urls import urlpatterns as social_type_urls
from .project_urls import urlpatterns as project_urls
from .service_urls import urlpatterns as service_urls
from ..views.auth_view import (SignupView, CurrentUserView, SigninView,
    ResetPasswordView, ResetPasswordConfirmView, LogoutView, UpdateProfilView)

urlpatterns = [
    path('', include(user_urls)),
    path('', include(social_urls)),
    path('', include(settings_urls)),
    path('', include(education_urls)),
    path('', include(contact_urls)),
    path('', include(experience_urls)),
    path('', include(category_urls)),
    path('', include(article_urls)),
    path('', include(skill_urls)),
    path('', include(social_type_urls)),
    path('', include(project_urls)),
    path('', include(service_urls)),
    
    # Authentification
    path('auth/register/', SignupView.as_view(), name='register'),
    path('auth/login/', SigninView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/current-user/', CurrentUserView.as_view(), name='current-user'),
    
    # Réinitialisation de mot de passe
    path('auth/password-reset/', ResetPasswordView.as_view(), name='password_reset_request'),
    path('auth/password-reset/confirm/', ResetPasswordConfirmView.as_view(), name='password_reset_confirm'),
    
    # Profil utilisateur
    path('auth/current-user/',CurrentUserView.as_view(), name='profile'),
    path('auth/profile/update-profile/', UpdateProfilView.as_view(), name='update_profile'),
    

]
