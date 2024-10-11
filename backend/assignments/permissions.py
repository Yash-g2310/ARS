from rest_framework import permissions
from .models import SubSpace,SubSpaceMember
from spaces.models import Space
    
class IsSubSpaceReviewerOrMemberElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        space_id = view.kwargs.get('pk',None)
        sub_space_id = view.kwargs.get('id',None)
        if space_id is None or sub_space_id is None:
            return super().has_permission(request,view)
        try:
            space = Space.objects.get(id=space_id)
            sub_space = SubSpace.objects.get(id=sub_space_id,space = space)
        except (Space.DoesNotExist,SubSpace.DoesNotExist):
            return False
        
        user = request.user
        if not user.is_authenticated:
            return False
        
        sub_space_member = sub_space.subspacemember_set.filter(space_member__user=user).first()
        if request.method in permissions.SAFE_METHODS:
            return user == space.owner or sub_space_member is not None
        else:
            return user == space.owner or (sub_space_member and sub_space_member.role == SubSpaceMember.REVIEWER)