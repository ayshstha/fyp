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
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

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
                return Response(
                    {
                        "user": self.serializer_class(user).data,
                        "token": token
                    }
                )
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
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


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        # Access the currently authenticated user
        user = request.user

        # Optionally, if you have a related profile model, you can include that data as well
        # Assuming you have a `Profile` model related to the User model with additional fields like phone
        try:
            profile_picture_url = request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None

            return Response({
                "name": user.full_name,  # Full name from the user
                "email": user.email,  # Email from the user
                "phone": user.phone_number if user.phone_number else None,  # Example of using profile fields
                "profile_picture": profile_picture_url,
            })
        except Exception as e:
            return Response({"error": "User profile not found."}, status=404)

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