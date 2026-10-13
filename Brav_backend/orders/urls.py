# orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderViewSet, CheckoutAPIView

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")

app_name = "orders"

urlpatterns = [
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
    path("", include(router.urls)),
]