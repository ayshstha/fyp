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


class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # New field

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'full_name', 'phone_number', 'profile_picture')  
        extra_kwargs = {
            'password': {'write_only': True},
        }
    

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return User.objects.create(**validated_data)