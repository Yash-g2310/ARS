from rest_framework import permissions
from .models import Space
from django.shortcuts import get_object_or_404

class IsOwnerOrMemberElseForbidden (permissions.BasePermission):
    def has_permission(self, request, view):
        space_id = view.kwargs.get('pk',None)
        if space_id is None:
            return super().has_permission(request,view)
        try:
            space = Space.objects.get(id=space_id)
        except Space.DoesNotExist:
            return False
        
        user = request.user
        if request.method in permissions.SAFE_METHODS:
            return user == space.owner or space.spacemember_set.filter(user = user).exists()
        else:
            return user == space.owner
        
class IsSpaceOwnerOrForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        space = get_object_or_404(Space,id= view.kwargs.get('pk'))
        return space.owner == request.user