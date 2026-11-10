# reviews/views.py
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from orders.models import OrderItem
from reviews.models import Review
from reviews.serializers import ReviewSerializer


@extend_schema_view(
    list=extend_schema(summary="List Product Reviews", tags=["Reviews"]),
    create=extend_schema(summary="Create Product Review", tags=["Reviews"]),
    retrieve=extend_schema(summary="Retrieve Review Details", tags=["Reviews"]),
    update=extend_schema(summary="Update Review", tags=["Reviews"]),
    partial_update=extend_schema(summary="Partial Update Review", tags=["Reviews"]),
    destroy=extend_schema(summary="Delete Review", tags=["Reviews"]),
)
class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing product reviews.
    Users can only review products they have previously purchased.
    """

    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product"]  # Automatically handles ?product=<id> filtering

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # OPTIMIZATION: Join user and product in a single SQL query to prevent N+1 hits
        return Review.objects.select_related("user", "product").all()

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data["product"]

        # Verify if the user has purchased this product through an order
        has_purchased = OrderItem.objects.filter(
            order__user=user, product=product
        ).exists()

        if not has_purchased:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You can only review products that you have already ordered and purchased."
            )

        # Save review with verified purchase flag
        serializer.save(user=user, is_verified_purchase=True)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # Ensure only the author can edit their review
        if instance.user != request.user and not request.user.is_staff:
            return Response(
                {"error": "You do not have permission to edit this review."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"message": "Review updated successfully.", "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_staff:
            return Response(
                {"error": "You do not have permission to delete this review."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(
            {"message": "Review deleted successfully."}, status=status.HTTP_200_OK
        )
