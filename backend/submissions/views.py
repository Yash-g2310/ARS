from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from submissions.serializers.serializers import AssignmentStatusSerializer,AssignmentSubmitSerializer,SubmissionListSerializer,SubmissionDetailSerializer
from submissions.serializers.review_serializers import StartReviewSerializer,EndReviewSubmissionSerializer
from django.shortcuts import get_object_or_404
from assignments.models import Assignment,AssignmentReviewer,AssignmentReviewee,AssignmentTeam
from assignments.permissions import IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden
from .permissions import IsAssignmentRevieweeOrTeamElseForbidden,IsAssignmentReviewerElseForbidden,IsAssignmentRevieweeTeamOrReviewerElseForbidden,SubmissionDetailPermission,ReviewNotStartedElseForbidden,ReviewerWithReviewInProgress
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
    
class StartReviewView(generics.UpdateAPIView):
    serializer_class = StartReviewSerializer
    permission_classes = [IsAssignmentReviewerElseForbidden,ReviewNotStartedElseForbidden]
    queryset = AssignmentSubmission.objects.all()
    lookup_field = "submission_id"
    
    def get_object(self):
        lookup_val = self.kwargs[self.lookup_field]
        return get_object_or_404(self.get_queryset(),id = lookup_val)
    
    def patch(self, request, *args, **kwargs):
        submission = self.get_object()
        if submission.status != AssignmentSubmission.NOT_STARTED:
            return Response({'error': 'Review can only be started if not already started.'},status=status.HTTP_400_BAD_REQUEST)
        try:
            reviewer = AssignmentReviewer.objects.get(assignment = self.kwargs.get('assignment_id'),reviewer__space_member__user = request.user)
        except AssignmentReviewer.DoesNotExist:
            return Response("No assignment Reviewer Found",status=status.HTTP_404_NOT_FOUND)
        submission.assignment_reviewer = reviewer
        submission.status = AssignmentSubmission.IN_PROGRESS
        submission.save()
        return Response({'message': 'Review started.'}, status=status.HTTP_200_OK)
    
class EndReviewSubmissionView(generics.UpdateAPIView):
    serializer_class = EndReviewSubmissionSerializer
    queryset = AssignmentSubmission.objects.all()
    permission_classes = [IsAssignmentReviewerElseForbidden,ReviewerWithReviewInProgress]
    lookup_field = "submission_id"
    
    def put(self, request, *args, **kwargs):
        submission = self.get_object()
        serializer = self.get_serializer(submission, data=request.data)
        serializer.is_valid(raise_exception =True)
        serializer.save()
        
        if submission.status == AssignmentSubmission.COMPLETED:
            if submission.assignment_reviewee:
                submission.assignment_reviewee.reviewee_status = AssignmentReviewee.COMPLETED
                submission.assignment_reviewee.save()
            if submission.assignment_team:
                submission.assignment_team.team_status = AssignmentTeam.COMPLETED
                submission.assignment_team.save()
        elif submission.status == AssignmentSubmission.REVIEWED:
            if submission.assignment_reviewee:
                submission.assignment_reviewee.reviewee_status = AssignmentReviewee.NOT_SUBMITTED
                submission.assignment_reviewee.save()
            if submission.assignment_team:
                submission.assignment_team.team_status = AssignmentTeam.NOT_SUBMITTED
                submission.assignment_team.save()
        submission.save()
        return Response({'message': 'Review ended successfully.'}, status=status.HTTP_200_OK)
    
    def get_object(self):
        lookup_val = self.kwargs[self.lookup_field]
        return get_object_or_404(self.get_queryset(),id = lookup_val)
    