from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, csrf_token  # Import csrf_token view

# Define the router and register the register viewset
router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')

# Define URL patterns
urlpatterns = [
    path('csrf/', csrf_token, name='csrf_token'),  # Add this line to expose CSRF token
    path('', include(router.urls)),  # Register the other API views
]
