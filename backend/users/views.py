from django.shortcuts import render
from . serializers import*
from .models import*
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
User = get_user_model()

from django.http import JsonResponse
from django.middleware.csrf import get_token


def csrf_token(request):
    # This view will return the CSRF token
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

class RegisterViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

