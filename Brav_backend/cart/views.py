# cart/views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view

from cart.models import Cart, CartItem
from cart.serializers import (
    CartSerializer,
    CartItemSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
)
from products.models import Product


class CartAPIView(generics.RetrieveAPIView):
    """
    GET /api/v1/cart/ - Retrieve the authenticated user's shopping cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    @extend_schema(summary="Get User Cart", tags=["Cart"])
    def get(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response({
            "message": "Cart retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


@extend_schema_view(
    list=extend_schema(summary="List Cart Items", tags=["Cart"]),
    create=extend_schema(summary="Add Item to Cart", request=AddCartItemSerializer, responses={201: CartItemSerializer}, tags=["Cart"]),
    retrieve=extend_schema(summary="Retrieve Cart Item", tags=["Cart"]),
    update=extend_schema(summary="Update Cart Item", request=UpdateCartItemSerializer, responses={200: CartItemSerializer}, tags=["Cart"]),
    partial_update=extend_schema(summary="Partial Update Cart Item", request=UpdateCartItemSerializer, responses={200: CartItemSerializer}, tags=["Cart"]),
    destroy=extend_schema(summary="Remove Item from Cart", tags=["Cart"]),
)
class CartItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing items inside the cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartItemSerializer

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def create(self, request, *args, **kwargs):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        product = get_object_or_404(Product, id=product_id, status=Product.Status.ACTIVE)
        cart, _ = Cart.objects.get_or_create(user=self.request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                'quantity': quantity,
                'unit_price': product.price
            }
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.unit_price = product.price
            cart_item.save()

        item_serializer = CartItemSerializer(cart_item)
        return Response(
            {
                "message": "Item added to cart successfully.",
                "data": item_serializer.data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        instance.quantity = serializer.validated_data['quantity']
        instance.unit_price = instance.product.price
        instance.save()

        item_serializer = CartItemSerializer(instance)
        return Response(
            {
                "message": "Cart item updated successfully.",
                "data": item_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "message": "Item removed from cart successfully."
            },
            status=status.HTTP_200_OK,
        )