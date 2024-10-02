from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Space
from .serializers import SpaceListSerializer,SpaceCreateDetailSerializer
# Create your views here.

class SpaceListView(generics.ListAPIView):
    serializer_class = SpaceListSerializer
    def get_queryset(self):
        user = self.request.user
        queryset= Space.objects.filter(owner = user) | Space.objects.filter(spacemember__user = user)
        return queryset.distinct()
    
class SpaceCreateView(generics.CreateAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceCreateDetailSerializer

class SpaceDetailView(generics.RetrieveUpdateAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceCreateDetailSerializer
    lookup_field = 'pk'