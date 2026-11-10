from django.contrib import admin

from orders.models import Coupon, Order, OrderItem

# Register your models here.

admin.site.register(Coupon)
admin.site.register(OrderItem)
admin.site.register(Order)
