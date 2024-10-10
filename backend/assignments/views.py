from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Assignment
from .serializers import AssignmentCreateSerializer
from .permissions import IsSubSpaceReviewerElseForbidden
from django.utils import timezone
from django.shortcuts import redirect,get_object_or_404
# Create your views here.

class AssignmentCreateView(generics.CreateAPIView):
    serializer_class = AssignmentCreateSerializer
    permission_classes = [IsSubSpaceReviewerElseForbidden]
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        print(self.kwargs)
        print(context)
        print("____________________________________________________________")
        context['sub_space_id'] = self.kwargs.get('id')
        context['space_id'] = self.kwargs.get('pk')
        return context
    
