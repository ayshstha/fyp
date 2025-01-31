from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    # Remove username field
    username = None
    
    # Only keeping the email and birthday fields
    email = models.EmailField(max_length=200, unique=True)
    birthday = models.DateField(null=True, blank=True)
    
    # Adding full name and phone number
    full_name = models.CharField(max_length=255, blank=True, null=True)  # Full name field
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Phone number field

    # Override first_name and last_name to be nullable
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)

    objects = CustomUserManager()
    
    # Set email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    
    # Since 'email' is the username field, no other fields are required for superuser
    REQUIRED_FIELDS = []  

    def __str__(self):
        return self.email
