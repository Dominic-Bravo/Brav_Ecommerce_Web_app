# products/views.py
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema_view, extend_schema
from products.models import Category, Product, ProductImage, InventoryLog
from products.serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
    InventoryLogSerializer,
)
from brav_core.permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(summary="List Categories", tags=["Categories"]),
    create=extend_schema(summary="Create Category", tags=["Categories"]),
    retrieve=extend_schema(summary="Retrieve Category", tags=["Categories"]),
    update=extend_schema(summary="Update Category", tags=["Categories"]),
    partial_update=extend_schema(summary="Partial Update Category", tags=["Categories"]),
    destroy=extend_schema(summary="Delete Category", tags=["Categories"]),
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"


@extend_schema_view(
    list=extend_schema(summary="List Products", tags=["Products"]),
    create=extend_schema(summary="Create Product", tags=["Products"]),
    retrieve=extend_schema(summary="Retrieve Product", tags=["Products"]),
    update=extend_schema(summary="Update Product", tags=["Products"]),
    partial_update=extend_schema(summary="Partial Update Product", tags=["Products"]),
    destroy=extend_schema(summary="Delete Product", tags=["Products"]),
)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(status=Product.Status.ACTIVE)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (getattr(user, "role", None) == "admin" or user.is_staff):
            return Product.objects.all()
        return Product.objects.filter(status=Product.Status.ACTIVE)


@extend_schema_view(
    list=extend_schema(summary="List Product Images", tags=["Products"]),
    create=extend_schema(summary="Create Product Image", tags=["Products"]),
    retrieve=extend_schema(summary="Retrieve Product Image", tags=["Products"]),
    update=extend_schema(summary="Update Product Image", tags=["Products"]),
    partial_update=extend_schema(summary="Partial Update Product Image", tags=["Products"]),
    destroy=extend_schema(summary="Delete Product Image", tags=["Products"]),
)
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]


@extend_schema_view(
    list=extend_schema(summary="List Inventory Logs", tags=["Inventory"]),
    create=extend_schema(summary="Create Inventory Log", tags=["Inventory"]),
    retrieve=extend_schema(summary="Retrieve Inventory Log", tags=["Inventory"]),
    update=extend_schema(summary="Update Inventory Log", tags=["Inventory"]),
    partial_update=extend_schema(summary="Partial Update Inventory Log", tags=["Inventory"]),
    destroy=extend_schema(summary="Delete Inventory Log", tags=["Inventory"]),
)
class InventoryLogViewSet(viewsets.ModelViewSet):
    queryset = InventoryLog.objects.all()
    serializer_class = InventoryLogSerializer
    permission_classes = [IsAdminOrReadOnly]