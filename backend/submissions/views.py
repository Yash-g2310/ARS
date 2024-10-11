from django.shortcuts import render
from rest_framework import generics
from .serializers import AssignmentStatusSerializer
from django.shortcuts import get_object_or_404
from assignments.models import Assignment
# from assignments.permissions import Is
# Create your views here.

class AssignmentStatusView(generics.ListAPIView):
    serializer_class = AssignmentStatusSerializer
    
    def get_queryset(self):
        assignment_id = self.kwargs.get('assignment_id',None)
        assignment = get_object_or_404(Assignment,id = assignment_id)
        return [assignment]
