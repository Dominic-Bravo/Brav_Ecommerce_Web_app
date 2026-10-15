# reviews/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from products.models import Category, Product
from orders.models import Order, OrderItem
from decimal import Decimal

User = get_user_model()


class ReviewAPITests(APITestCase):

    def setUp(self):
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

        self.customer = User.objects.create_user(
            email="customer@brav.com",
            password="password123",
            first_name="Jane",
            last_name="Customer",
            role="customer",
        )

        self.review_url = reverse("reviews:review-list")

    def test_cannot_review_unpurchased_product(self):
        """Users should get 403 Forbidden if they try to review a product they haven't bought."""
        self.client.force_authenticate(user=self.customer)
        payload = {
            "product": str(self.product.id),
            "rating": 5,
            "comment": "Amazing mouse!"
        }
        response = self.client.post(self.review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_review_purchased_product(self):
        """Users should successfully review a product after purchasing it."""
        # Simulate a completed order containing the product
        order = Order.objects.create(
            user=self.customer,
            order_number="ORD-TEST999",
            total_amount=Decimal("29.99"),
            shipping_address="123 Main St",
            payment_method="Credit Card"
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=1,
            unit_price=Decimal("29.99"),
            subtotal=Decimal("29.99")
        )

        self.client.force_authenticate(user=self.customer)
        payload = {
            "product": str(self.product.id),
            "rating": 5,
            "comment": "Amazing mouse, works great!"
        }
        response = self.client.post(self.review_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["is_verified_purchase"])
        self.assertEqual(response.data["rating"], 5)