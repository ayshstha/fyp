from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, LoginViewset, csrf_token, UserProfileView, ChangePasswordView, EditProfileView

# Define the router and register the viewsets
router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')  # ✅ Now LoginViewset is imported

# Define URL patterns
urlpatterns = [
    path('csrf/', csrf_token, name='csrf_token'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),  # New line
    path('user/edit-profile/', EditProfileView.as_view(), name='edit-profile'),  
    path('', include(router.urls)),
]
if settings.DEBUG:  # Only in development mode
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)