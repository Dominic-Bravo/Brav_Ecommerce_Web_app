# orders/serializers.py
from rest_framework import serializers

from orders.models import Order, OrderItem
from products.serializers import ProductSerializer
from orders.models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "code",
            "type",
            "value",
            "min_order_amount",
            "max_discount_amount",
            "usage_limit",
            "used_count",
            "start_date",
            "end_date",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "used_count", "created_at", "updated_at"]

class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for individual items inside an order."""

    product_details = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_details",
            "quantity",
            "unit_price",
            "subtotal",
            "created_at",
        ]
        read_only_fields = ["id", "subtotal", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    """Detailed serializer for user orders including items."""

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "total_amount",
            "shipping_address",
            "payment_method",
            "payment_status",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "status",
            "total_amount",
            "payment_status",
            "created_at",
            "updated_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    """Input payload required to convert a user's shopping cart into an order."""

    address_id = serializers.UUIDField(
        help_text="UUID of the user's saved address to snapshot."
    )
    payment_method = serializers.CharField(max_length=50, default="Credit Card")
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
