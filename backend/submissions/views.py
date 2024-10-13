from django.shortcuts import render
from rest_framework import generics
from submissions.serializers.serializers import AssignmentStatusSerializer,AssignmentSubmitSerializer,SubmissionListSerializer,SubmissionDetailSerializer
from django.shortcuts import get_object_or_404
from assignments.models import Assignment
from assignments.permissions import IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden
from .permissions import IsAssignmentRevieweeOrTeamElseForbidden,IsAssignmentReviewerElseForbidden,IsAssignmentRevieweeTeamOrReviewerElseForbidden,SubmissionDetailPermission
from .models import AssignmentSubmission
# from assignments.permissions import Is
# Create your views here.

class AssignmentStatusView(generics.RetrieveAPIView):
    serializer_class = AssignmentStatusSerializer
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden]
    queryset = Assignment.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'assignment_id'
    
    
class AssignmentSubmitSoloView(generics.CreateAPIView):
    serializer_class = AssignmentSubmitSerializer
    permission_classes = [IsAssignmentRevieweeOrTeamElseForbidden]
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['assignment_reviewee'] = self.kwargs.get('assignment_reviewee_id')
        return context
    
class AssignmentSubmitTeamView(generics.CreateAPIView):
    serializer_class = AssignmentSubmitSerializer
    permission_classes = [IsAssignmentRevieweeOrTeamElseForbidden]
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['assignment_team'] = self.kwargs.get('assignment_team_id')
        return context
    
class AssignmentSubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionListSerializer
    
    def get_permissions(self):
        assignment_reviewee_id = self.kwargs.get('assignment_reviewee_id')
        assignment_team_id = self.kwargs.get('assignment_team_id')
        if not (assignment_reviewee_id or assignment_team_id):
            self.permission_classes = [IsAssignmentReviewerElseForbidden]
        else:
            self.permission_classes = [IsAssignmentRevieweeTeamOrReviewerElseForbidden]
        return super().get_permissions()
    
    def get_queryset(self):
        assignment_id = self.kwargs.get("assignment_id")
        assignment_reviewee_id = self.kwargs.get('assignment_reviewee_id')
        assignment_team_id = self.kwargs.get('assignment_team_id')
        
        if not (assignment_team_id or assignment_reviewee_id):
            queryset = AssignmentSubmission.objects.filter(assignment_reviewee__assignment = assignment_id) | AssignmentSubmission.objects.filter(assignment_team__assignment = assignment_id)
        elif assignment_reviewee_id and not assignment_team_id:
            queryset = AssignmentSubmission.objects.filter(assignment_reviewee = assignment_reviewee_id)
        elif assignment_team_id and not assignment_reviewee_id:
            queryset = AssignmentSubmission.objects.filter(assignment_team = assignment_team_id)
        return queryset.distinct()

class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionDetailSerializer
    permission_classes = [SubmissionDetailPermission]
    lookup_field = 'submission_id'
    queryset = AssignmentSubmission.objects.all()
    
    def get_object(self):
        lookup_val = self.kwargs[self.lookup_field]
        return get_object_or_404(self.get_queryset(),id = lookup_val)
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['submission_id'] = self.kwargs.get('submission_id')
        return context