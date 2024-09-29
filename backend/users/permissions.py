from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.user.is_superuser:
            return True
        return obj == request.user
    
class IsNotAuthenticated(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return not request.user.is_authenticated