from rest_framework import permissions
from assignments.models import AssignmentReviewee,TeamMember,AssignmentReviewer
from django.db.models import Q

class IsAssignmentRevieweeOrTeamElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_reviewee_id = view.kwargs.get('assignment_reviewee_id')
        assignment_team_id = view.kwargs.get('assignment_team_id')
        
        if not request.user.is_authenticated:
            return False
        
        if not (assignment_reviewee_id or assignment_team_id):
            return False
        if  (assignment_reviewee_id and assignment_team_id):
            return False
        
        if assignment_reviewee_id:
            try:
                assignment_reviewee = AssignmentReviewee.objects.get(id=assignment_reviewee_id)
                return request.user == assignment_reviewee.reviewee.space_member.user
            except AssignmentReviewee.DoesNotExist:
                return False
        if assignment_team_id:
            return TeamMember.objects.filter(
                team=assignment_team_id,
                member__space_member__user=request.user
            ).exists()

        return False
    
class IsAssignmentReviewerElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_id = view.kwargs.get('assignment_id')
        if not assignment_id:
            return False
        return AssignmentReviewer.objects.filter(assignment= assignment_id, reviewer__space_member__user = request.user).exists()

class IsAssignmentRevieweeTeamOrReviewerElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_id = view.kwargs.get('assignment_id')
        assignment_reviewee_id =  view.kwargs.get('assignment_reviewee_id')
        assignment_team_id =  view.kwargs.get('assignment_team_id')
        
        if not request.user.is_authenticated:
            return False
        
        if not assignment_id:
            return False
        
        if not (assignment_reviewee_id or assignment_team_id):
            return False
        is_authorized = (
            AssignmentReviewer.objects.filter(
                Q(assignment=assignment_id) &
                Q(reviewer__space_member__user=request.user)
            ).exists() or
            AssignmentReviewee.objects.filter(
                Q(id = assignment_reviewee_id) &
                Q(assignment=assignment_id) &
                Q(reviewee__space_member__user=request.user)
            ).exists() or
            TeamMember.objects.filter(
                Q(team__assignment=assignment_id) &
                Q(team=assignment_team_id) &
                Q(member__space_member__user=request.user)
            ).exists()
        )
        return is_authorized