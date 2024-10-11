from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Assignment
from .serializers import AssignmentCreateSerializer,AssignmentListSerializer,AssignmentRetrieveUpdateSerializer
from .permissions import IsSubSpaceReviewerOrMemberElseForbidden
from django.utils import timezone
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
        queryset =Assignment.objects.filter(sub_space = sub_space_id)
        return queryset.distinct()
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        sub_space_id = self.kwargs.get('id')
        sub_space_member = SubSpaceMember.objects.filter(sub_space = sub_space_id, space_member__user = self.request.user).first()
        context['space_id']  = self.kwargs.get('pk')
        context['sub_space_member']  = sub_space_member
        return context
    
class AssignmentRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = AssignmentRetrieveUpdateSerializer
    permission_classes = [IsSubSpaceReviewerOrMemberElseForbidden]
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
    
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)