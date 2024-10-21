from rest_framework import permissions
from .models import SubSpace,SubSpaceMember,AssignmentReviewee,AssignmentReviewer,TeamMember,Assignment
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

class IsVisibleOrMemberElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_id = view.kwargs.get('assignment_id')
        if not assignment_id:
            return super().has_permission(request, view)
        
        try:
            obj = Assignment.objects.get(id = assignment_id)
        except Assignment.DoesNotExist:
            return False
        
        user = request.user
        if not user.is_authenticated:
            return False
        
        if obj.visible_to_all:
            return super().has_permission(request, view)
        
        is_reviewer = AssignmentReviewer.objects.filter(assignment = obj, reviewer__space_member__user = user).exists()
        is_reviewee = AssignmentReviewee.objects.filter(assignment = obj, reviewee__space_member__user = user).exists()
        is_team = TeamMember.objects.filter(team__assignment = obj,member__space_member__user =user).exists()
        print(is_reviewee or is_reviewer or is_team)
        
        return is_reviewee or is_reviewer or is_team
        