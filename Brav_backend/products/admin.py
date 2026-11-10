from django.contrib import admin
from django.utils.safestring import mark_safe

from products.models import Category, InventoryLog, Product, ProductImage

# Register your models here.

admin.site.register(Category)
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Add 'display_image' to the list_display tuple
    list_display = ('name', 'category', 'price', 'stock_quantity', 'status', 'display_image')

    # Optional: Also show the image preview inside the detailed edit form
    readonly_fields = ('display_image',)

    def display_image(self, obj):
        if obj.image_url:
            # Renders a small thumbnail preview of the image
            return mark_safe(f'<img src="{obj.image_url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
        return "No Image"

    # Sets the column header title in the admin list view
    display_image.short_description = 'Image Preview'
admin.site.register(ProductImage)
admin.site.register(InventoryLog)
