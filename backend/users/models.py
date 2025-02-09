from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings


class CustomUserManager(BaseUserManager):
    """ Custom User Manager handling Admin and Regular Users """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """ Superuser = Admin """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Admin must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Admin must have is_superuser=True.")
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """ Custom User Model with email authentication (Superuser = Admin) """

    username = None  # Remove username field
    email = models.EmailField(max_length=200, unique=True)
    birthday = models.DateField(null=True, blank=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    """ Send Password Reset Email """

    sitelink = "http://localhost:5173/"
    token = reset_password_token.key
    full_link = f"{sitelink}password-reset/{token}"

    print(f"Token: {token}")
    print(f"Reset Link: {full_link}")

    context = {
        "full_link": full_link,
        "email_address": reset_password_token.user.email
    }

    html_message = render_to_string("backend/email.html", context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject=f"Password Reset Request for {reset_password_token.user.email}",
        body=plain_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()
