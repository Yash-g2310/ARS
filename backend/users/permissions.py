from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.user.is_superuser:
            return True
        return obj.user == request.user

class IsOwnerOrForbidden(permissions.BasePermission):
    
    def has_permission(self, request, view):
        # print(request.user.is_authenticated)
        username =view.kwargs.get('username',None)
        # print(view.kwargs)
        # print(username)
        if username is None:
            return super().has_permission(request,view)
        else:
            if username == request.user.username:
                return True
            else:
                return False
    
class IsNotAuthenticated(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return not request.user.is_authenticated