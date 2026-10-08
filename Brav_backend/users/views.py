# users/views.py
from django.conf import settings
from django.middleware.csrf import get_token

from rest_framework import status, permissions, viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse

from users.models import Profile, Address
from users.serializers import (
    RegisterSerializer,
    UserResponseSerializer,
    LoginSerializer,
    LogoutSerializer,
    UserMeSerializer,
    ProfileSerializer,
    AddressSerializer,
)

from brav_core.permissions import (
    IsAuthenticatedUser,
    IsCustomerUserRole,
    IsAdminUserRole,
)

from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Attaches HttpOnly cookie to response."""
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=refresh_token,
        max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
    )


# ==========================================
# AUTHENTICATION & SOCIAL LOGIN VIEWS
# ==========================================

class BaseCustomSocialLoginView(SocialLoginView):
    permission_classes = [permissions.AllowAny]

    def get_response(self):
        """
        Custom response structure matching standard login:
        Returns access token in JSON and attaches refresh token in HttpOnly cookie.
        """
        original_response = super().get_response()
        
        access_token = original_response.data.get("access")
        refresh_token = original_response.data.get("refresh")
        user_data = UserMeSerializer(self.user).data

        custom_response = Response(
            {
                "access": access_token,
                "user": user_data,
            },
            status=status.HTTP_200_OK,
        )

        if refresh_token:
            set_refresh_cookie(custom_response, refresh_token)

        return custom_response


class GoogleLoginAPIView(BaseCustomSocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = f"{settings.FRONTEND_URL}/accounts/google/login/callback/"

    @extend_schema(
        summary="Google OAuth2 Login",
        description="Accepts Google OAuth code/token and authenticates or registers user.",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class FacebookLoginAPIView(BaseCustomSocialLoginView):
    adapter_class = FacebookOAuth2Adapter

    @extend_schema(
        summary="Facebook OAuth2 Login",
        description="Accepts Facebook access_token and authenticates or registers user.",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(
        request=RegisterSerializer,
        responses={201: UserResponseSerializer},
        summary="Register a new customer",
        description="Creates a new customer user record and returns JWT access and refresh tokens.",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserResponseSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "message": "User registered successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        request=LoginSerializer,
        summary="Login User",
        description="Authenticates user, returns Access Token in JSON, and sets Refresh Token in HttpOnly cookie.",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "access": str(refresh.access_token),
                "user": UserMeSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        set_refresh_cookie(response, str(refresh))
        get_token(request)

        return response


class TokenRefreshAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LogoutSerializer  # Fallback serializer for docs

    @extend_schema(
        summary="Refresh Access Token",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        if not refresh_token:
            return Response({"detail": "Refresh token missing from cookie."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            data = {"access": str(refresh.access_token)}

            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                refresh.set_jti()
                refresh.set_exp()
                new_refresh = str(refresh)

            response = Response(data, status=status.HTTP_200_OK)

            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                set_refresh_cookie(response, new_refresh)

            return response
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LogoutSerializer

    @extend_schema(
        summary="Logout User",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        response.delete_cookie(
            settings.SIMPLE_JWT['AUTH_COOKIE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        return response


# ==========================================
# USER PROFILE & ACCOUNT MANAGEMENT VIEWS
# ==========================================

class UserMeAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Returns current authenticated user's details.
    PATCH/PUT: Updates allowed user profile fields.
    DELETE: Deletes the user account and cascades all related data.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserMeSerializer

    def get_object(self):
        return self.request.user

    @extend_schema(
        summary="Get Current User Profile",
        responses={200: UserMeSerializer},
        tags=["Users"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Update Current User Profile (Partial)",
        request=UserMeSerializer,
        responses={200: UserMeSerializer},
        tags=["Users"],
    )
    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Update Current User Profile (Full)",
        request=UserMeSerializer,
        responses={200: UserMeSerializer},
        tags=["Users"],
    )
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Delete Account",
        description="Permanently deletes the currently authenticated user and all associated records (profile, addresses, tokens).",
        responses={204: OpenApiResponse(description="Account successfully deleted.")},
        tags=["Users"],
    )
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(
            {"message": "Account successfully deleted."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/users/me/profile/ - Get current user's profile
    PATCH /api/v1/users/me/profile/ - Update current user's profile
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    @extend_schema(summary="Get User Extended Profile", tags=["Users"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(summary="Update User Extended Profile", request=ProfileSerializer, tags=["Users"])
    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


# ==========================================
# ADDRESS CRUD VIEWSET
# ==========================================

@extend_schema_view(
    list=extend_schema(summary="List User Addresses", tags=["Addresses"]),
    create=extend_schema(summary="Create User Address", tags=["Addresses"]),
    retrieve=extend_schema(summary="Retrieve Single Address", tags=["Addresses"]),
    update=extend_schema(summary="Update Address (Full)", tags=["Addresses"]),
    partial_update=extend_schema(summary="Update Address (Partial)", tags=["Addresses"]),
    destroy=extend_schema(summary="Delete Address", tags=["Addresses"]),
)
class AddressViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for User Addresses with explicit success message responses.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            "message": "Addresses retrieved successfully.",
            "data": response.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "message": "Address retrieved successfully.",
            "data": response.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "message": "Address created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(
            {
                "message": "Address updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "message": "Address deleted successfully."
            },
            status=status.HTTP_200_OK
        )


# ==========================================
# PERMISSION TESTING VIEWS
# ==========================================

class AuthenticatedTestView(APIView):
    permission_classes = [IsAuthenticatedUser]

    @extend_schema(
        summary="Test Authenticated User Access",
        description="Accessible by any logged-in user regardless of role (Customer or Admin).",
        responses={200: OpenApiResponse(description="Access granted.")},
        tags=["Testing / Permissions"],
    )
    def get(self, request):
        return Response(
            {
                "message": f"Hello, {request.user.first_name}! You are authenticated.",
                "user_id": str(request.user.id),
                "role": request.user.role,
            },
            status=status.HTTP_200_OK,
        )


class CustomerOnlyTestView(APIView):
    permission_classes = [IsCustomerUserRole]

    @extend_schema(
        summary="Test Customer Role Access",
        description="Accessible ONLY by users with role='customer'.",
        responses={
            200: OpenApiResponse(description="Customer access granted."),
            403: OpenApiResponse(description="Permission denied."),
        },
        tags=["Testing / Permissions"],
    )
    def get(self, request):
        return Response(
            {
                "message": "Welcome Customer! You have access to customer endpoints.",
                "role": request.user.role,
            },
            status=status.HTTP_200_OK,
        )


class AdminOnlyTestView(APIView):
    permission_classes = [IsAdminUserRole]

    @extend_schema(
        summary="Test Admin Role Access",
        description="Accessible ONLY by users with role='admin' or staff status.",
        responses={
            200: OpenApiResponse(description="Admin access granted."),
            403: OpenApiResponse(description="Permission denied."),
        },
        tags=["Testing / Permissions"],
    )
    def get(self, request):
        return Response(
            {
                "message": "Welcome Admin! You have access to administrative controls.",
                "role": request.user.role,
            },
            status=status.HTTP_200_OK,
        )


class AllOnlyTestView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Test All Role Access",
        description="Accessible by all users.",
        responses={
            200: OpenApiResponse(description="Anonymous access granted."),
            403: OpenApiResponse(description="Permission denied."),
        },
        tags=["Testing / Permissions"],
    )
    def get(self, request):
        user_role = getattr(request.user, 'role', 'Anonymous') if request.user and request.user.is_authenticated else 'Anonymous'
        return Response(
            {
                "message": "Welcome Anonymous! You have access to this api.",
                "role": user_role,
            },
            status=status.HTTP_200_OK,
        )