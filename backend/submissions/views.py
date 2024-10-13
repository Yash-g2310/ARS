from django.shortcuts import render
from rest_framework import generics
from submissions.serializers.serializers import AssignmentStatusSerializer,AssignmentSubmitSerializer,SubmissionListSerializer
from django.shortcuts import get_object_or_404
from assignments.models import Assignment
from assignments.permissions import IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden
from .permissions import IsAssignmentRevieweeOrTeamElseForbidden,IsAssignmentReviewerElseForbidden
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
    permission_classes = [IsAssignmentReviewerElseForbidden]
    def get_queryset(self):
        queyset = AssignmentSubmission.objects.filter(assignment_reviewee__assignment = self.kwargs.get("assignment_id")) | AssignmentSubmission.objects.filter(assignment_team__assignment = self.kwargs.get("assignment_id"))
        
        return queyset.distinct()
