from django.shortcuts import render
from rest_framework import generics,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import UserSerializer, UserProfileSerializer
from .models import UserProfile
# Create your views here.

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request,username=username,password = password)
        
        if user is not None:
            login(request,user)
            return Response({'message':'Login Successful'},status = status.HTTP_200_OK)
        else:
            return Response({'error':'Invalide credintials'},status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful!'}, status=status.HTTP_200_OK) 

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'username'
    def get_object(self):
        return super().get_object()
    
# class UserProfileUpdateView(generics.UpdateAPIView):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer
#     lookup_field = 'username'
#     def 

