from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver 
from django.urls import reverse 
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

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

    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
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
    
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost:5173/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink) + str("password-reset/") + str(token)

    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_address': reset_password_token.user.email
    }

    # Render the email HTML content
    html_message = render_to_string("backend/email.html", context=context)
    plain_message = strip_tags(html_message)

    # Use the settings from your `settings.py`
    msg = EmailMultiAlternatives(
        subject="Request for resetting password for {title}".format(title=reset_password_token.user.email),
        body=plain_message,
        from_email=settings.EMAIL_HOST_USER,  # Use the environment variable EMAIL_HOST_USER
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()
