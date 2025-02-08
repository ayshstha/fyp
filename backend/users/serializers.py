from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password  # For password hashing

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret


from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser  # Import your CustomUser model


class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # Optional field

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'full_name', 'phone_number', 'profile_picture')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Hash the password
        validated_data['password'] = make_password(validated_data['password'])

        # Create the user
        user = CustomUser.objects.create(**validated_data)

        return user

