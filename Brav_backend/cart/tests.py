# cart/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from products.models import Category, Product
from cart.models import Cart, CartItem

User = get_user_model()


class CartAPITests(APITestCase):

    def setUp(self):
        # 1. Create a Category and Product for testing
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        self.product = Product.objects.create(
            category=self.category,
            name="Wireless Mouse",
            slug="wireless-mouse",
            description="Ergonomic mouse",
            price="29.99",
            stock_quantity=50,
            sku="MOU-001",
            status="active"
        )

        # 2. Create a customer user
        self.customer = User.objects.create_user(
            email="customer@brav.com",
            password="password123",
            first_name="Jane",
            last_name="Customer",
            role="customer",
        )

        # Use direct URL strings or namespaced reverse safely
        try:
            self.cart_url = reverse("cart:cart-detail")
            self.cart_items_url = reverse("cart:cart-item-list")
        except Exception:
            self.cart_url = "/api/v1/cart/"
            self.cart_items_url = "/api/v1/cart/items/"

    def test_authenticated_user_can_view_cart(self):
        """A logged-in user should be able to view or automatically create their cart."""
        self.client.force_authenticate(user=self.customer)
        response = self.client.get(self.cart_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("items", response.data["data"])
        self.assertEqual(float(response.data["data"]["total_price"]), 0.0)

    def test_add_item_to_cart(self):
        """Users should be able to add a product to their cart."""
        self.client.force_authenticate(user=self.customer)
        payload = {
            "product_id": str(self.product.id),
            "quantity": 2
        }
        response = self.client.post(self.cart_items_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["quantity"], 2)
        self.assertEqual(float(response.data["data"]["subtotal"]), 59.98)

    def test_update_cart_item_quantity(self):
        """Users should be able to update item quantities in their cart."""
        self.client.force_authenticate(user=self.customer)
        
        cart = Cart.objects.create(user=self.customer)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1, unit_price=self.product.price)
        
        try:
            update_url = reverse("cart:cart-item-detail", args=[str(cart_item.id)])
        except Exception:
            update_url = f"/api/v1/cart/items/{cart_item.id}/"
            
        payload = {"quantity": 3}
        response = self.client.patch(update_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["quantity"], 3)

    def test_remove_item_from_cart(self):
        """Users should be able to delete items from their cart."""
        self.client.force_authenticate(user=self.customer)
        
        cart = Cart.objects.create(user=self.customer)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1, unit_price=self.product.price)
        
        try:
            delete_url = reverse("cart:cart-item-detail", args=[str(cart_item.id)])
        except Exception:
            delete_url = f"/api/v1/cart/items/{cart_item.id}/"
            
        response = self.client.delete(delete_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CartItem.objects.count(), 0)