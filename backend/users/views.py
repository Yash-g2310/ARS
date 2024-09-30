import requests
from django.shortcuts import render,redirect
from rest_framework import generics,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import UserSerializer, UserProfileSerializer,RestrictedUserProfileSerializer,ChangePasswordSerializer,ChangeUsernameSerializer
from .models import UserProfile
from .permissions import IsOwnerOrReadOnly,IsNotAuthenticated,IsOwnerOrForbidden
from constants.constants import AUTH_URL,CLIENT_ID,REDIRECT_URI,CLIENT_SECRET,AUTH_POST_URL,USER_DATA_URL
# Create your views here.

class LoginView(APIView):
    permission_classes = [IsNotAuthenticated]
    
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
    permission_classes = [IsNotAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
# class UserProfileListView(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserProfileSerializer
#     filter_backends = [filters.SearchFilter]
#     permission_classes=[IsOwnerOrReadOnly]
#     search_fields = ['username','first_name','last_name','email']

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    # serializer_class = UserProfileSerializer
    lookup_field = 'username'
    permission_classes = [IsOwnerOrReadOnly]
    
    def get_object(self):
        return super().get_object()
    
    def get_serializer_class(self):
        if self.request.user == self.get_object():
            return UserProfileSerializer
        return RestrictedUserProfileSerializer

class ChanneliTokenView(APIView):
    permission_classes = [IsNotAuthenticated]
    def get(self, request,*args, **kwargs):
        REDIRECT_URL = f"{AUTH_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
        print(REDIRECT_URL)
        return redirect(REDIRECT_URL)
    

class ChanneliTokenRecall(APIView):
    permission_classes = [IsNotAuthenticated]
    def get(self,request,*args, **kwargs):
        auth_code = request.query_params.get('code',None)
        if auth_code is None:
            return Response({'error':'authorisation code is missing'},status=status.HTTP_400_BAD_REQUEST)
        
        token_data = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URI,
            'code': auth_code
        }
        
        try:
            print()
            res = requests.post(AUTH_POST_URL,data = token_data)
            res.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response({"error":"failed to obtain access token",'details':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        data = res.json()
        if 'error' in data:
            return Response({"error":data["error"]},status=status.HTTP_400_BAD_REQUEST)
        
        TOKEN_TYPE = data.get('token_type')
        ACCESS_TOKEN = data.get('access_token')
        header = {'Authorization': f"{TOKEN_TYPE} {ACCESS_TOKEN}"}
        try:
            res = requests.get(USER_DATA_URL,headers=header)
            res.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response({"error":"failed to obtain access token",'details':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        data = res.json()
        if data.get('detail',None) is not None:
            return Response(data,status=res.status_code)
        return Response(data,status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsOwnerOrForbidden]
    def post(self,request,*args, **kwargs):
        serializer = ChangePasswordSerializer(data = request.data,context = {"request":request})
        serializer.is_valid(raise_exception  = True)
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"detail":"Password updated successfully"},status=status.HTTP_200_OK)

class ChangeUsernameView(APIView):
    permission_classes = [IsOwnerOrForbidden]
    def post(self,request,*args, **kwargs):
        serializer = ChangeUsernameSerializer(data = request.data,context = {"request":request})
        serializer.is_valid(raise_exception  = True)
        user = request.user
        user.username = serializer.validated_data['new_username']
        user.save()
        return Response({"detail":"Username updated successfully"},status=status.HTTP_200_OK)