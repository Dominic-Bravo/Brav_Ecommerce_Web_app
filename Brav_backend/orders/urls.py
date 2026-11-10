# orders/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from orders.views import CheckoutAPIView, OrderViewSet, CouponViewSet

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")
router.register(r"coupons", CouponViewSet, basename="coupon")

app_name = "orders"

urlpatterns = [
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
    path("", include(router.urls)),
]
