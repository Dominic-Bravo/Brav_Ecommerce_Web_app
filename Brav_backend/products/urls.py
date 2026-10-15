# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import (
    CategoryViewSet,
    ProductViewSet,
    ProductImageViewSet,
    InventoryLogViewSet,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"products", ProductViewSet, basename="product")
router.register(r"product-images", ProductImageViewSet, basename="product-image")
router.register(r"inventory-logs", InventoryLogViewSet, basename="inventory-log")

app_name = "products"

urlpatterns = [
    path("", include(router.urls)),
]