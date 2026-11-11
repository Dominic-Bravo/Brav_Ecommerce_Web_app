# orders/tests.py
import threading
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cart.models import Cart, CartItem
from orders.models import Order
from products.models import Category, Product
from users.models import Address

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
            status="active",
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
            is_default=True,
        )

        # 4. Add items to user's Cart
        self.cart = Cart.objects.create(user=self.customer)
        self.cart_item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2,
            unit_price=self.product.price,
        )

        self.checkout_url = reverse("orders:checkout")
        self.order_list_url = reverse("orders:order-list")

    def test_customer_can_checkout_cart(self):
        """Checkout should convert cart into an order, reduce stock, and clear cart."""
        self.client.force_authenticate(user=self.customer)
        payload = {"address_id": str(self.address.id), "payment_method": "Credit Card"}

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
            payment_method="Credit Card",
        )

        response = self.client.get(self.order_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)  # Check inside 'results'
        self.assertEqual(response.data["results"][0]["order_number"], "ORD-TEST1234")

    def test_concurrent_checkout_race_condition(self):
        """
        Two users attempt to purchase items simultaneously when stock is limited.
        Ensures pessimistic locking prevents overselling.
        """
        # Set stock low to exactly 2 items available
        self.product.stock_quantity = 2
        self.product.save()

        # Set first customer's cart quantity to demand both items
        self.cart_item.quantity = 2
        self.cart_item.save()

        # Create a second customer with their own address, cart, and demand for 2 items
        customer2 = User.objects.create_user(
            email="customer2@brav.com", password="password123", role="customer"
        )
        address2 = Address.objects.create(
            user=customer2,
            street_address="456 Other St",
            city="Davao City",
            state="Davao del Sur",
            postal_code="8000",
            country="Philippines",
            is_default=True,
        )
        cart2 = Cart.objects.create(user=customer2)
        CartItem.objects.create(
            cart=cart2,
            product=self.product,
            quantity=2,
            unit_price=self.product.price,
        )

        results = []

        def make_checkout_request(user, address_id):
            from rest_framework.test import APIClient
            client = APIClient()
            client.force_authenticate(user=user)
            try:
                response = client.post(
                    self.checkout_url,
                    {"address_id": str(address_id), "payment_method": "Credit Card"},
                    format="json"
                )
                results.append((response.status_code, response.data))
            except Exception as e:
                results.append(("EXCEPTION", str(e)))

        # Fire concurrent requests using threads
        t1 = threading.Thread(target=make_checkout_request, args=(self.customer, self.address.id))
        t2 = threading.Thread(target=make_checkout_request, args=(customer2, address2.id))

        t1.start()
        t2.start()
        t1.join()
        t2.join()

        # Print out what actually happened in the threads for debugging
        print("\n--- THREAD RESULTS ---")
        for r in results:
            print(r)
        print("----------------------\n")

        # Standard assertions (will fail until we see the output, but lets keep them)
        status_codes = [res[0] for res in results]
        self.assertEqual(status_codes.count(status.HTTP_201_CREATED), 1)
        self.assertEqual(status_codes.count(status.HTTP_400_BAD_REQUEST), 1)

        # Stock should hit 0 safely and never go negative
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)
