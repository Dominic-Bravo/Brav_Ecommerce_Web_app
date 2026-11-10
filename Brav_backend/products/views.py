# products/views.py
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from brav_core.permissions import IsAdminOrReadOnly

# products/views.py
from products.filters import ProductFilter
from products.models import Category, InventoryLog, Product, ProductImage
from products.serializers import (
    CategorySerializer,
    InventoryLogSerializer,
    ProductImageSerializer,
    ProductSerializer,
)


@extend_schema_view(
    list=extend_schema(summary="List Categories", tags=["Categories"]),
    create=extend_schema(summary="Create Category", tags=["Categories"]),
    retrieve=extend_schema(summary="Retrieve Category", tags=["Categories"]),
    update=extend_schema(summary="Update Category", tags=["Categories"]),
    partial_update=extend_schema(
        summary="Partial Update Category", tags=["Categories"]
    ),
    destroy=extend_schema(summary="Delete Category", tags=["Categories"]),
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    pagination_class = None


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

    # hook django filter
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name", "description", "sku"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user

        # Base queryset depending on user role
        if user.is_authenticated and (
            getattr(user, "role", None) == "admin" or user.is_staff
        ):
            qs = Product.objects.all()
        else:
            qs = Product.objects.filter(status=Product.Status.ACTIVE)

        # OPTIMIZATION: Join Category in SQL and prefetch ProductImages to prevent N+1 hits
        return qs.select_related("category").prefetch_related("images")


@extend_schema_view(
    list=extend_schema(summary="List Product Images", tags=["Products"]),
    create=extend_schema(summary="Create Product Image", tags=["Products"]),
    retrieve=extend_schema(summary="Retrieve Product Image", tags=["Products"]),
    update=extend_schema(summary="Update Product Image", tags=["Products"]),
    partial_update=extend_schema(
        summary="Partial Update Product Image", tags=["Products"]
    ),
    destroy=extend_schema(summary="Delete Product Image", tags=["Products"]),
)
class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # OPTIMIZATION: Join the parent Product to avoid extra queries per image
        return ProductImage.objects.select_related("product").all()


@extend_schema_view(
    list=extend_schema(summary="List Inventory Logs", tags=["Inventory"]),
    create=extend_schema(summary="Create Inventory Log", tags=["Inventory"]),
    retrieve=extend_schema(summary="Retrieve Inventory Log", tags=["Inventory"]),
    update=extend_schema(summary="Update Inventory Log", tags=["Inventory"]),
    partial_update=extend_schema(
        summary="Partial Update Inventory Log", tags=["Inventory"]
    ),
    destroy=extend_schema(summary="Delete Inventory Log", tags=["Inventory"]),
)
class InventoryLogViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryLogSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # OPTIMIZATION: Join product and the user who changed it
        return InventoryLog.objects.select_related("product", "changed_by").all()
