# products/filters.py
import django_filters

from products.models import Product


class ProductFilter(django_filters.FilterSet):
    # Filter by category slug (e.g., /api/v1/products/?category=electronics)
    category = django_filters.CharFilter(
        field_name="category__slug", lookup_expr="exact"
    )

    # Filter price ranges (e.g., /api/v1/products/?min_price=10&max_price=100)
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["category", "status", "min_price", "max_price"]
