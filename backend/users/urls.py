from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, LoginViewset, csrf_token  # ✅ Added LoginViewset

# Define the router and register the viewsets
router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')  # ✅ Now LoginViewset is imported

# Define URL patterns
urlpatterns = [
    path('csrf/', csrf_token, name='csrf_token'),
    path('', include(router.urls)),
]
