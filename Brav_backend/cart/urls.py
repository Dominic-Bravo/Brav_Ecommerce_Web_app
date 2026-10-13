# cart/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cart.views import CartAPIView, CartItemViewSet

router = DefaultRouter()
router.register(r'items', CartItemViewSet, basename='cart-item')

app_name = 'cart'

urlpatterns = [
    path('', CartAPIView.as_view(), name='cart-detail'),
    path('', include(router.urls)),
]
