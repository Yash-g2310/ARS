from rest_framework import permissions
from assignments.models import AssignmentReviewee,TeamMember,AssignmentReviewer
from django.db.models import Q
from .models import AssignmentSubmission

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
    
    
class SubmissionDetailPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_submission_id = view.kwargs.get('submission_id')
        assignment_id = view.kwargs.get('assignment_id')
        try:
            assignment_submission = AssignmentSubmission.objects.get(id = assignment_submission_id)
        except AssignmentSubmission.DoesNotExist:
            return False
        if assignment_submission.assignment_reviewee:
            is_reviewee = assignment_submission.assignment_reviewee.reviewee.space_member.user == request.user
        else: is_reviewee= False
        if assignment_submission.assignment_team:
            assignment_team = assignment_submission.assignment_team
            is_team = TeamMember.objects.filter(team = assignment_team, member__space_member__user =request.user).exists()
        else: is_team = False
        is_reviewer = AssignmentReviewer.objects.filter(assignment = assignment_id,reviewer__space_member__user = request.user)
        
        return is_reviewee or is_reviewer or is_team

class ReviewNotStartedElseForbidden(permissions.BasePermission):
    def has_permission(self, request, view):
        submission_id = view.kwargs.get('submission_id')
        if not submission_id:
            return False
        try:
            submission = AssignmentSubmission.objects.get(id = submission_id)
        except AssignmentSubmission.DoesNotExist:
            return False
        return submission.status==AssignmentSubmission.NOT_STARTED

class ReviewerWithReviewInProgress(permissions.BasePermission):
    def has_permission(self, request, view):
        submission_id = view.kwargs.get('submission_id')
        if not submission_id:
            return False
        try:
            submission = AssignmentSubmission.objects.get(id = submission_id)
        except AssignmentSubmission.DoesNotExist:
            return False
        return submission.assignment_reviewer.reviewer.space_member.user == request.user and submission.status == AssignmentSubmission.IN_PROGRESS

    