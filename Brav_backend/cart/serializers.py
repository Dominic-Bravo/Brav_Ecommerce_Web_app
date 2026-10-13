# cart/serializers.py
from rest_framework import serializers
from cart.models import Cart, CartItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for individual cart items with product info and subtotal."""
    product_details = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_details', 'quantity', 'unit_price', 'subtotal', 'created_at']
        read_only_fields = ['id', 'unit_price', 'created_at', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantity * obj.unit_price


class CartSerializer(serializers.ModelSerializer):
    """Serializer for the user's shopping cart, including all items and total price."""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        return sum(item.quantity * item.unit_price for item in obj.items.all())


class AddCartItemSerializer(serializers.Serializer):
    """Input serializer for adding products to the cart."""
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Input serializer for updating cart item quantities."""
    quantity = serializers.IntegerField(min_value=1)