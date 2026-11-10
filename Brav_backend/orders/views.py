# orders/views.py
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.response import Response

from orders.models import Order, Coupon
from orders.serializers import CheckoutSerializer, OrderSerializer, CouponSerializer
from orders.services import process_checkout
from brav_core.permissions import IsAdminUserRole

from rest_framework import viewsets
from drf_spectacular.utils import extend_schema_view, extend_schema
from orders.models import Coupon
from orders.serializers import CouponSerializer
from brav_core.permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(
        summary="List available coupons",
        description="Retrieve a list of active coupons. Accessible to anyone (including anonymous users).",
        tags=["Coupons"]
    ),
    create=extend_schema(
        summary="Create a new coupon",
        description="Create a new discount coupon. Restricted to admin users.",
        tags=["Coupons"]
    ),
    retrieve=extend_schema(
        summary="Retrieve coupon details",
        description="Get detailed information about a specific coupon. Restricted to admin users.",
        tags=["Coupons"]
    ),
    update=extend_schema(
        summary="Full update of a coupon",
        description="Replace all fields of an existing coupon. Restricted to admin users.",
        tags=["Coupons"]
    ),
    partial_update=extend_schema(
        summary="Partial update of a coupon",
        description="Update specific fields of a coupon. Restricted to admin users.",
        tags=["Coupons"]
    ),
    destroy=extend_schema(
        summary="Delete a coupon",
        description="Permanently delete a coupon. Restricted to admin users.",
        tags=["Coupons"]
    ),
)
class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by("-created_at")
    serializer_class = CouponSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        """
        If an anonymous or regular customer is viewing the list,
        optionally filter to only show active coupons that haven't expired.
        Admins can see everything.
        """
        queryset = super().get_queryset()
        user = self.request.user

        # If the user is an admin or staff, let them see all coupons
        if user.is_authenticated and (getattr(user, "role", None) == "admin" or user.is_staff or user.is_superuser):
            return queryset

        # For anonymous users or regular customers, only show active and valid coupons
        # (Optional: remove this filter if you want them to see inactive ones too)
        return queryset.filter(is_active=True)

@extend_schema_view(
    list=extend_schema(summary="List Orders (User/Admin)", tags=["Orders"]),
    retrieve=extend_schema(summary="Retrieve Order Details", tags=["Orders"]),
)
class OrderViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    ReadOnly ViewSet for viewing orders.
    Customers see only their own orders. Admins see all store orders.
    Orders are immutable and cannot be modified or deleted directly via API.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        # OPTIMIZATION: Prefetch related items and products in a single database hit
        base_qs = Order.objects.select_related("user").prefetch_related(
            "items__product"
        )

        if getattr(user, "role", None) == "admin" or user.is_staff:
            return base_qs.all()
        return base_qs.filter(user=user)


# orders/views.py (Checkout view becomes clean and concise)
class CheckoutAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CheckoutSerializer

    @extend_schema(
        summary="Process Cart Checkout",
        description="Converts active cart items into a permanent order, handles stock deduction, snapshot address, and clears cart.",
        request=CheckoutSerializer,
        responses={201: OrderSerializer},
        tags=["Orders"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Delegate everything to the service layer
        order = process_checkout(
            user=request.user,
            address_id=serializer.validated_data["address_id"],
            payment_method=serializer.validated_data.get(
                "payment_method", "Credit Card"
            ),
            coupon_code=serializer.validated_data.get("coupon_code"),
        )

        serializer_response = OrderSerializer(order)
        return Response(
            {
                "message": "Checkout completed successfully.",
                "data": serializer_response.data,
            },
            status=status.HTTP_201_CREATED,
        )
