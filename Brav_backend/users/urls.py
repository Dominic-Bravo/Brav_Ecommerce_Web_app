from django.urls import include, path
from rest_framework.routers import DefaultRouter

from users.views import (
    AddressViewSet,
    FacebookLoginAPIView,
    GoogleLoginAPIView,
    LoginAPIView,
    LogoutAPIView,
    ProfileRetrieveUpdateAPIView,
    RegisterAPIView,
    TokenRefreshAPIView,
    UserMeAPIView,
)

router = DefaultRouter()
router.register(r"addresses", AddressViewSet, basename="address")

app_name = "users"

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="auth_register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshAPIView.as_view(), name="token_refresh"),
    # Social Auth
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google_login"),
    path("auth/facebook/", FacebookLoginAPIView.as_view(), name="facebook_login"),
    # # Profile Route
    path("me/profile/", ProfileRetrieveUpdateAPIView.as_view(), name="user_profile"),
    path("me/", UserMeAPIView.as_view(), name="me"),
    # Address CRUD Routes (includes /, /{id}/, etc.)
    path("", include(router.urls)),
]
