# common/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthenticatedUser(BasePermission):
    """Allows access only to authenticated users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsAdminUserRole(BasePermission):
    """Allows access only to authenticated users with the 'admin' role or superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )


class IsCustomerUserRole(BasePermission):
    """Allows access only to authenticated users with the 'customer' role."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role == 'customer'
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Allows read-only access (GET, HEAD, OPTIONS) to any authenticated user,
    but write actions (POST, PUT, PATCH, DELETE) require an Admin role.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
            
        if request.method in SAFE_METHODS:
            return True
            
        return bool(request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission to allow access only to owners of the object or admins.
    Assumes the target model instance has a `user` attribute.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin' or request.user.is_staff:
            return True
            
        # Check if object belongs to the user (e.g. Order.user or Address.user)
        owner = getattr(obj, 'user', None)
        return owner == request.user