# orders/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from products.models import Category, Product
from cart.models import Cart, CartItem
from users.models import Address
from orders.models import Order, Coupon
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class OrderAPITests(APITestCase):

    def setUp(self):
        # 1. Create Category and Product with sufficient stock
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        self.product = Product.objects.create(
            category=self.category,
            name="Wireless Mouse",
            slug="wireless-mouse",
            description="Ergonomic mouse",
            price="29.99",
            stock_quantity=10,
            sku="MOU-001",
            status="active"
        )

        # 2. Create Customer User
        self.customer = User.objects.create_user(
            email="customer@brav.com",
            password="password123",
            first_name="Jane",
            last_name="Customer",
            role="customer",
        )

        # 3. Create a saved Address for the customer
        self.address = Address.objects.create(
            user=self.customer,
            street_address="123 Main St",
            city="Davao City",
            state="Davao del Sur",
            postal_code="8000",
            country="Philippines",
            is_default=True
        )

        # 4. Add items to user's Cart
        self.cart = Cart.objects.create(user=self.customer)
        self.cart_item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2,
            unit_price=self.product.price
        )

        self.checkout_url = reverse("orders:checkout")
        self.order_list_url = reverse("orders:order-list")

    def test_customer_can_checkout_cart(self):
        """Checkout should convert cart into an order, reduce stock, and clear cart."""
        self.client.force_authenticate(user=self.customer)
        payload = {
            "address_id": str(self.address.id),
            "payment_method": "Credit Card"
        }

        response = self.client.post(self.checkout_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["payment_method"], "Credit Card")
        self.assertEqual(float(response.data["data"]["total_amount"]), 59.98)

        # Verify stock was reduced from 10 to 8
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 8)

        # Verify cart was cleared
        self.assertEqual(self.cart.items.count(), 0)

    def test_customer_can_view_own_orders(self):
        """Customers should be able to view their list of orders."""
        self.client.force_authenticate(user=self.customer)
        
        # Create an order directly
        order = Order.objects.create(
            user=self.customer,
            order_number="ORD-TEST1234",
            total_amount=Decimal("59.98"),
            shipping_address="123 Main St, Davao City",
            payment_method="Credit Card"
        )

        response = self.client.get(self.order_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["order_number"], "ORD-TEST1234")