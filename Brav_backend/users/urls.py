from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import ( RegisterAPIView, LoginAPIView, LogoutAPIView, AuthenticatedTestView, CustomerOnlyTestView,AdminOnlyTestView, AllOnlyTestView, UserMeAPIView, TokenRefreshAPIView, GoogleLoginAPIView, FacebookLoginAPIView, ProfileRetrieveUpdateAPIView,
    AddressViewSet )

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"addresses", AddressViewSet, basename="address")

app_name = 'users'

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='auth_register'),

    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshAPIView.as_view(), name="token_refresh"),
    path("me/", UserMeAPIView.as_view(), name="me"),

    # Social Auth
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google_login"),
    path("auth/facebook/", FacebookLoginAPIView.as_view(), name="facebook_login"),

    # Permission Test Routes
    path('test/authenticated/', AuthenticatedTestView.as_view(), name='test_authenticated'),
    path('test/customer-only/', CustomerOnlyTestView.as_view(), name='test_customer'),
    path('test/admin-only/', AdminOnlyTestView.as_view(), name='test_admin'),
    path('test/anonymous/', AllOnlyTestView.as_view(), name='test_anoymous'),

    # Profile Route
    path("me/profile/", ProfileRetrieveUpdateAPIView.as_view(), name="user_profile"),

    # Address CRUD Routes (includes /, /{id}/, etc.)
    path("", include(router.urls)),
]