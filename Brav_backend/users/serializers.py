from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import authenticate

from users.models import Profile, Address

User = get_user_model()

# register user
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'password',
            'password_confirm',
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': True},
        }

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return normalized_email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Create user instance
        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Automatically build connected Profile record
        Profile.objects.create(user=user)

        return user


class UserResponseSerializer(serializers.ModelSerializer):
    """Clean representation serializer for outputting created user details."""
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'is_active',
            'created_at',
        )

class UserMeSerializer(serializers.ModelSerializer):
    """Serializer for fetching the authenticated user's profile."""

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "email", "is_active", "created_at"]

# login user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    def validate(self, attrs):
        email = attrs.get('email', '').lower().strip()
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs['user'] = user
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        required=True,
        help_text="The refresh token to blacklist."
    )


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for reading and updating user profiles."""

    class Meta:
        model = Profile
        fields = ["id", "avatar", "date_of_birth", "gender", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for CRUD operations on user addresses."""

    class Meta:
        model = Address
        fields = [
            "id",
            "type",
            "full_name",
            "phone",
            "street_address",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        # Automatically bind the address to the currently authenticated user
        user = self.context["request"].user
        return Address.objects.create(user=user, **validated_data)