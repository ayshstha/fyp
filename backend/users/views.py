from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password
from .serializers import *
from .models import *
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.core.files.storage import default_storage
from knox.models import AuthToken
from django.http import JsonResponse
from django.middleware.csrf import get_token


User = get_user_model()

class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)

            if user:
                _, token = AuthToken.objects.create(user)

                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "phone_number": user.phone_number,
                    "is_superuser": user.is_superuser,  # Check if user is a superuser
                }

                if user.is_superuser:
                    user_data["role"] = "Admin"
                    user_data["message"] = "Welcome, Admin!"
                else:
                    user_data["role"] = "User"
                    user_data["message"] = "Welcome, User!"

                return Response({"user": user_data, "token": token})

            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)


def csrf_token(request):
    # This view will return the CSRF token
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


class RegisterViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


# In views.py
class UserViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            # Return all users except superusers
            return CustomUser.objects.filter(is_superuser=False)
        return CustomUser.objects.filter(id=user.id)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profile_picture_url = (
            request.build_absolute_uri(user.profile_picture.url)
            if user.profile_picture else None
        )

        user_data = {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone_number,
            "profile_picture": profile_picture_url,  # Full URL
            "role": "Admin" if user.is_superuser else "User",
        }

        if user.is_superuser:
            all_users = CustomUser.objects.all().values("id", "full_name", "email")
            user_data["managed_users"] = list(all_users)

        return Response(user_data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not check_password(current_password, user.password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"error": "New password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Prevent session logout
        
        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Update fields if provided
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "email" in data:
            user.email = data["email"]
        if "phone_number" in data:
            user.phone_number = data["phone_number"]
 
        # Handle profile picture upload
        if "profile_picture" in request.FILES:
            # Delete old profile picture if it exists
            if user.profile_picture:
                default_storage.delete(user.profile_picture.path)
            user.profile_picture = request.FILES["profile_picture"]

        user.save()
        return Response(
            {"message": "Profile updated successfully."},
            status=status.HTTP_200_OK,
        )


class AdminManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        
        # Admin-only logic here
        users = CustomUser.objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data)
    

from django.db.models import Exists, OuterRef

# views.py
class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.filter(is_booked=False)  # Only show unbooked dogs
    serializer_class = AdoptionSerializer

from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    

class ToggleFeaturedFeedback(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, feedback_id):
        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        # Toggle the featured status without any limit
        feedback.featured = not feedback.featured
        feedback.save()

        return Response({"message": "Feedback featured status toggled successfully", "featured": feedback.featured})

    
#
class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        dog = serializer.validated_data['dog']
        
        # Check for existing pending/approved requests
        if AdoptionRequest.objects.filter(dog=dog, status__in=['pending', 'approved']).exists():
            raise serializers.ValidationError("This dog already has an active request")
        
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['approved', 'rejected']:
            return Response(
                {"error": "Invalid status. Use 'approved' or 'rejected'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Handle approval
        if new_status == 'approved':
            # Mark dog as booked and reject others
            instance.dog.is_booked = True
            instance.dog.save()
            AdoptionRequest.objects.filter(
                dog=instance.dog,
                status='pending'
            ).exclude(id=instance.id).update(status='rejected')
        
        # Handle rejection
        elif new_status == 'rejected':
            # Only unbook if no other approved requests exist
            if not AdoptionRequest.objects.filter(
                dog=instance.dog,
                status='approved'
            ).exists():
                instance.dog.is_booked = False
                instance.dog.save()
        
        instance.status = new_status
        instance.save()
        
        return Response(self.get_serializer(instance).data)

    def get_queryset(self):
        if self.request.user.is_superuser:
            # Return ALL requests for admins
            return AdoptionRequest.objects.all()
        # For regular users, return their own requests
        return AdoptionRequest.objects.filter(user=self.request.user)
    
