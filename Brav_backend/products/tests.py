# products/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from products.models import Category

User = get_user_model()


class ProductAPITests(APITestCase):

    def setUp(self):
        # Create a Category for testing products
        self.category = Category.objects.create(name="Electronics", slug="electronics")

        # Create standard Customer user
        self.customer = User.objects.create_user(
            email="customer@brav.com",
            password="password123",
            first_name="Jane",
            last_name="Customer",
            role="customer",
        )

        # Create Admin user
        self.admin_user = User.objects.create_user(
            email="admin@brav.com",
            password="password123",
            first_name="Admin",
            last_name="Boss",
            role="admin",
        )

        self.product_url = reverse("products:product-list")
        self.valid_product_payload = {
            "category": str(self.category.id),
            "name": "Wireless Mouse",
            "slug": "wireless-mouse",
            "description": "Ergonomic wireless mouse",
            "price": "29.99",
            "stock_quantity": 50,
            "sku": "MOU-001",
            "status": "active",
        }

    def test_authenticated_user_can_view_products(self):
        """Authenticated users should be able to list products (GET)."""
        self.client.force_authenticate(user=self.customer)
        response = self.client.get(self.product_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_cannot_create_product(self):
        """Customers with role='customer' should get 403 Forbidden when trying to create a product."""
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(self.product_url, self.valid_product_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product(self):
        """Admin users with role='admin' should successfully create a product."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.product_url, self.valid_product_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Standard DRF ViewSet returns the object directly at root level
        self.assertEqual(response.data["name"], "Wireless Mouse")