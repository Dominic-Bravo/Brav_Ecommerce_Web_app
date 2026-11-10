import uuid
from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from cart.models import Cart
from orders.models import Coupon, Order, OrderItem
from products.models import Product
from users.models import Address


def _get_user_cart_items(user):
    """Fetches active cart items or raises an error if empty/missing."""
    try:
        cart = Cart.objects.prefetch_related("items").get(user=user)
    except Cart.DoesNotExist:
        raise ValidationError({"error": "No active cart found."})

    cart_items = cart.items.all()
    if not cart_items.exists():
        raise ValidationError({"error": "Your cart is empty."})
    return cart_items


def _get_shipping_address_snapshot(user, address_id):
    """Validates and formats the user's shipping address."""
    address_obj = get_object_or_404(Address, id=address_id, user=user)
    return (
        f"{address_obj.street_address}, {address_obj.city}, "
        f"{address_obj.state}, {address_obj.postal_code}, {address_obj.country}"
    )


def _lock_and_validate_stock(cart_items):
    """Locks products to prevent race conditions and validates sufficient stock."""
    product_ids = [item.product_id for item in cart_items]

    locked_products = {
        p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids).order_by('id')
    }

    subtotal_amount = Decimal("0.00")
    for item in cart_items:
        product = locked_products.get(item.product_id)
        if not product or product.stock_quantity < item.quantity:
            product_name = getattr(product, 'name', 'item')
            raise ValidationError(
                {"error": f"Insufficient stock for product '{product_name}'."}
            )
        subtotal_amount += item.unit_price * item.quantity

    return locked_products, subtotal_amount


def _apply_coupon(coupon_code, subtotal_amount):
    """Locks the coupon, validates constraints, and computes the discount amount."""
    if not coupon_code:
        return Decimal("0.00")

    try:
        # Lock coupon row to prevent simultaneous overuse race conditions
        coupon = Coupon.objects.select_for_update().get(code=coupon_code, is_active=True)
    except Coupon.DoesNotExist:
        raise ValidationError({"error": "Invalid coupon code."})

    now = timezone.now()
    if not (coupon.start_date <= now <= coupon.end_date):
        raise ValidationError({"error": "Coupon is expired or not active yet."})

    if subtotal_amount < coupon.min_order_amount:
        raise ValidationError(
            {"error": f"Order total must be at least {coupon.min_order_amount} for this coupon."}
        )

    if coupon.usage_limit is not None and coupon.used_count >= coupon.usage_limit:
        raise ValidationError({"error": "This coupon has reached its maximum usage limit."})

    # Calculate discount
    discount_amount = Decimal("0.00")
    if coupon.type == Coupon.CouponType.PERCENTAGE:
        discount_amount = subtotal_amount * (coupon.value / Decimal(100))
        if coupon.max_discount_amount and discount_amount > coupon.max_discount_amount:
            discount_amount = coupon.max_discount_amount
    elif coupon.type == Coupon.CouponType.FIXED:
        discount_amount = coupon.value

    # Increment usage count securely under lock
    coupon.used_count += 1
    coupon.save(update_fields=['used_count'])

    return discount_amount


def _create_order_and_fulfill_items(user, shipping_address, payment_method, final_total, cart_items, locked_products):
    """Creates the order record, generates order items, updates stock, and clears the cart."""
    order = Order.objects.create(
        user=user,
        order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
        total_amount=final_total,
        shipping_address=shipping_address,
        payment_method=payment_method,
        status=Order.OrderStatus.PENDING,
        payment_status=Order.PaymentStatus.PENDING,
    )

    for cart_item in cart_items:
        product = locked_products[cart_item.product_id]

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=cart_item.quantity,
            unit_price=cart_item.unit_price,
            subtotal=cart_item.unit_price * cart_item.quantity,
        )

        product.stock_quantity -= cart_item.quantity
        product.save(update_fields=['stock_quantity'])

    cart_items.delete()
    return order


def process_checkout(user, address_id, payment_method="Credit Card", coupon_code=None):
    """Orchestrates the checkout pipeline inside a single atomic transaction."""
    cart_items = _get_user_cart_items(user)
    shipping_address_snapshot = _get_shipping_address_snapshot(user, address_id)

    with transaction.atomic():
        locked_products, subtotal_amount = _lock_and_validate_stock(cart_items)
        discount_amount = _apply_coupon(coupon_code, subtotal_amount)

        final_total = max(Decimal("0.00"), subtotal_amount - discount_amount)

        order = _create_order_and_fulfill_items(
            user=user,
            shipping_address=shipping_address_snapshot,
            payment_method=payment_method,
            final_total=final_total,
            cart_items=cart_items,
            locked_products=locked_products,
        )

    return order
