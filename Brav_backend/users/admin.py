from django.contrib import admin

from users.models import Address, Profile, User

# Register your models here.

admin.site.register(User)
admin.site.register(Address)
admin.site.register(Profile)
