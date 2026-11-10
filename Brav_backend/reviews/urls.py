# reviews/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from reviews.views import ReviewViewSet

router = DefaultRouter()
router.register(r"", ReviewViewSet, basename="review")

app_name = "reviews"

urlpatterns = [
    path("", include(router.urls)),
]
