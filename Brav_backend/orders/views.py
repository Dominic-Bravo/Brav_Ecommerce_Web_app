# orders/views.py
import uuid
from decimal import Decimal
from django.utils import timezone
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view

from orders.models import Order, OrderItem, Coupon
from orders.serializers import OrderSerializer, CheckoutSerializer
from cart.models import Cart
from users.models import Address
from brav_core.permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(summary="List Orders (User/Admin)", tags=["Orders"]),
    retrieve=extend_schema(summary="Retrieve Order Details", tags=["Orders"]),
)
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing orders. 
    Customers see only their own orders. Admins see all store orders.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "admin" or user.is_staff:
            return Order.objects.all().prefetch_related("items__product")
        return Order.objects.filter(user=user).prefetch_related("items__product")


class CheckoutAPIView(generics.CreateAPIView):
    """
    POST /api/v1/orders/checkout/ - Convert user cart into a confirmed order.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CheckoutSerializer

    @extend_schema(
        summary="Process Cart Checkout",
        description="Converts the active cart items into a permanent order, handles stock deduction, snapshot address, and clears cart.",
        request=CheckoutSerializer,
        responses={201: OrderSerializer},
        tags=["Orders"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_id = serializer.validated_data["address_id"]
        payment_method = serializer.validated_data.get("payment_method", "Credit Card")
        coupon_code = serializer.validated_data.get("coupon_code")

        # 1. Fetch user cart and check if it has items
        try:
            cart = Cart.objects.prefetch_related("items__product").get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "No active cart found."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Fetch and validate shipping address belonging to the user
        address_obj = get_object_or_404(Address, id=address_id, user=request.user)
        shipping_address_snapshot = (
            f"{address_obj.street_address}, {address_obj.city}, "
            f"{address_obj.state}, {address_obj.postal_code}, {address_obj.country}"
        )

        # 3. Calculate subtotal & validate stock inside an atomic transaction
        with transaction.atomic():
            subtotal_amount = Decimal("0.00")
            for item in cart_items:
                if item.product.stock_quantity < item.quantity:
                    return Response(
                        {"error": f"Insufficient stock for product '{item.product.name}'."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                subtotal_amount += item.unit_price * item.quantity

            # 4. Handle Coupon Discounts if provided
            discount_amount = Decimal("0.00")
            if coupon_code:
                try:
                    coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                    now = timezone.now()
                    if coupon.start_date <= now <= coupon.end_date:
                        if subtotal_amount >= coupon.min_order_amount:
                            if coupon.type == Coupon.CouponType.PERCENTAGE:
                                discount_amount = subtotal_amount * (coupon.value / Decimal("100"))
                                if coupon.max_discount_amount and discount_amount > coupon.max_discount_amount:
                                    discount_amount = coupon.max_discount_amount
                            elif coupon.type == Coupon.CouponType.FIXED:
                                discount_amount = coupon.value
                            
                            coupon.used_count += 1
                            coupon.save()
                        else:
                            return Response({"error": f"Order total must be at least {coupon.min_order_amount} for this coupon."}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({"error": "Coupon is expired or not active yet."}, status=status.HTTP_400_BAD_REQUEST)
                except Coupon.DoesNotExist:
                    return Response({"error": "Invalid coupon code."}, status=status.HTTP_400_BAD_REQUEST)

            final_total = max(Decimal("0.00"), subtotal_amount - discount_amount)

            # 5. Create Order Record
            order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            order = Order.objects.create(
                user=request.user,
                order_number=order_number,
                total_amount=final_total,
                shipping_address=shipping_address_snapshot,
                payment_method=payment_method,
                status=Order.OrderStatus.PENDING,
                payment_status=Order.PaymentStatus.PENDING,
            )

            # 6. Create Order Items and Deduct Stock
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.unit_price,
                    subtotal=cart_item.unit_price * cart_item.quantity,
                )

                # Deduct stock
                product = cart_item.product
                product.stock_quantity -= cart_item.quantity
                product.save()

            # 7. Clear Cart items after successful checkout
            cart_items.delete()

        serializer_response = OrderSerializer(order)
        return Response(
            {
                "message": "Checkout completed successfully.",
                "data": serializer_response.data,
            },
            status=status.HTTP_201_CREATED,
        )