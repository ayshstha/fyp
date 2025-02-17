from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterViewset, 
    LoginViewset, 
    csrf_token, 
    UserProfileView, 
    FeedbackViewSet,
    AdoptionViewSet,
    ChangePasswordView,
    EditProfileView, 
    ToggleFeaturedFeedback,
    AdoptionRequestViewSet,
    UserViewset
)

# Define the router and register the viewsets
router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')
router.register('users', UserViewset, basename="user")
router.register('Adoption', AdoptionViewSet, basename='Adoption')
router.register('feedback', FeedbackViewSet, basename='feedback')
# urls.py
router.register('adoption-requests', AdoptionRequestViewSet, basename='adoption-requests')

# Define URL patterns
urlpatterns = [
    path('csrf/', csrf_token, name='csrf_token'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/edit-profile/', EditProfileView.as_view(), name='edit-profile'),  
    path('', include(router.urls)),  # Include router URLs (feedback is here)
    path('feedback/toggle-featured/<int:feedback_id>/', ToggleFeaturedFeedback.as_view(), name='toggle-featured-feedback'),
    
]

if settings.DEBUG:  # Only in development mode
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)