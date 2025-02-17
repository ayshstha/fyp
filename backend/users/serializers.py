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

from .models import Adoption

class AdoptionSerializer(serializers.ModelSerializer):
    is_booked = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Adoption
        fields = '__all__'


from .models import Feedback
class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'message', 'created_at', 'user', 'featured')

    def get_user(self, obj):
        profile_picture_url = (
            self.context['request'].build_absolute_uri(obj.user.profile_picture.url)
            if obj.user.profile_picture else None
        )

        return {
            'id': obj.user.id,
            'full_name': obj.user.full_name,
            'profile_picture': profile_picture_url  # Full URL
        }

from .models import AdoptionRequest
class AdoptionRequestSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    dog = AdoptionSerializer(read_only=True)
    
    class Meta:
        model = AdoptionRequest
        fields = ('id', 'user', 'dog', 'pickup_date', 'status', 'created_at')
    
    def get_user(self, obj):
        user = obj.user
        profile_picture_url = (
            self.context['request'].build_absolute_uri(user.profile_picture.url)
            if user.profile_picture else None
        )
        return {
            'id': user.id,
            'full_name': user.full_name,
            'profile_picture': profile_picture_url,
            'phone_number': user.phone_number,
        }