from django.contrib import admin
from products.models import Category, ProductImage, Product, InventoryLog

# Register your models here.

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(InventoryLog)
