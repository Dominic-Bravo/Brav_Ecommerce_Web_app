# products/serializers.py
from rest_framework import serializers
from products.models import Category, Product, ProductImage, InventoryLog


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for product categories, including nested sub-categories (children)."""
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "parent",
            "children",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for additional product images."""

    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "is_primary", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    """Detailed serializer for products including nested images and category details."""
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "slug",
            "description",
            "price",
            "stock_quantity",
            "sku",
            "image_url",
            "status",
            "images",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class InventoryLogSerializer(serializers.ModelSerializer):
    """Serializer for tracking stock adjustments and sales logs (Admin only)."""

    class Meta:
        model = InventoryLog
        fields = ["id", "product", "type", "quantity", "reference_id", "created_at"]
        read_only_fields = ["id", "created_at"]