from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Assignment,AssignmentReviewee,AssignmentReviewer,AssignmentTeam,TeamMember
from .serializers import AssignmentCreateSerializer,AssignmentListSerializer,AssignmentRetrieveUpdateSerializer,AssignmentMemberSerializer,UserAssignmentRevieweeSerializer
from .permissions import IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden
from django.utils import timezone
from django.db.models import Q
from django.shortcuts import redirect,get_object_or_404
from spaces.models import SubSpace,SubSpaceMember
# Create your views here.

class AssignmentCreateView(generics.CreateAPIView):
    serializer_class = AssignmentCreateSerializer
    queryset = Assignment.objects.all() 
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden]
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['sub_space_id'] = self.kwargs.get('id')
        context['space_id'] = self.kwargs.get('pk')
        return context
    
class AssignmentListView(generics.ListAPIView):
    serializer_class =AssignmentListSerializer
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden]
    lookup_field = 'id'
    
    def get_queryset(self):
        sub_space_id = self.kwargs.get('id')
        # space_id = self.kwargs.get('pk')
        
        # space_member = Space
        
        user = self.request.user
        visible_assignments =Q(sub_space=sub_space_id, visible_to_all=True)
        try:
            sub_space_member = SubSpaceMember.objects.get(space_member__user = user, sub_space = sub_space_id)
        except SubSpaceMember.DoesNotExist:
            return Response({"error":"sub_space_member not found"},status=status.HTTP_404_NOT_FOUND)
        
        user_related_assignments = Q(
            id__in = AssignmentReviewer.objects.filter(reviewer = sub_space_member).values_list('assignment',flat=True)
        ) | Q(
            id__in = AssignmentReviewee.objects.filter(reviewee = sub_space_member).values_list('assignment', flat=True)
        ) | Q(
            id__in=AssignmentTeam.objects.filter(id__in=TeamMember.objects.filter(member=sub_space_member).values_list('team', flat=True)).values_list('assignment', flat=True)
        )
        queryset = Assignment.objects.filter(visible_assignments | user_related_assignments)
        return queryset.distinct()
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        sub_space_id = self.kwargs.get('id')
        sub_space_member = SubSpaceMember.objects.filter(sub_space = sub_space_id, space_member__user = self.request.user).first()
        context['space_id']  = self.kwargs.get('pk')
        context['sub_space_member']  = sub_space_member
        return context
    
class AssignmentRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AssignmentRetrieveUpdateSerializer
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden]
    queryset = Assignment.objects.prefetch_related(
        'assignmentsubtask_set', 
        'assignmentdetails_set', 
        'assignmentreviewer_set',
        'assignmentreviewee_set', 
        'assignmentteam_set'
    )
    lookup_field = 'assignment_id'
    def get_object(self):
        lookup_val = self.kwargs[self.lookup_field]
        return get_object_or_404(self.get_queryset(),id = lookup_val)
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['sub_space_id'] = self.kwargs.get('id')
        context['space_id'] = self.kwargs.get('pk')
        context['assignment_id'] = self.kwargs.get('assignment_id')
        return context
    
    def destroy(self, request, *args, **kwargs):
        assignment = self.get_object()
        self.perform_destroy(assignment)
        return Response({"details":"assignment deleted successfully"},status=status.HTTP_204_NO_CONTENT)

class AssignmentMembersView(generics.RetrieveAPIView):
    serializer_class=AssignmentMemberSerializer
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden,IsVisibleOrMemberElseForbidden]
    queryset = Assignment.objects.all()
    
    def get_object(self):
        assignment_id = self.kwargs.get('assignment_id')
        return generics.get_object_or_404(self.get_queryset(), id=assignment_id)
    
class UserAssignmentsRevieweeView(generics.ListAPIView):
    serializer_class = UserAssignmentRevieweeSerializer
    permissions = [IsSubSpaceReviewerOrMemberElseForbidden, IsVisibleOrMemberElseForbidden]

    def get_queryset(self):
        user = self.request.user

        subspace_members = SubSpaceMember.objects.filter(
            space_member__user=user
        )

        assignments = AssignmentReviewee.objects.filter(
            reviewee__in = subspace_members
        ).distinct().select_related(
            'assignment',
            'reviewee',
        )

        return assignments