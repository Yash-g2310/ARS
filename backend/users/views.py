import requests
from django.shortcuts import redirect
from rest_framework import generics , permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from rest_framework import filters
# from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import UserSerializer, UserProfileSerializer,RestrictedUserProfileSerializer,ChangePasswordSerializer,ChangeUsernameSerializer,UserDestroySerializer
from .models import UserProfile
from .permissions import IsOwnerOrReadOnly,IsNotAuthenticated,IsOwnerOrForbidden
from .utility import getUserInfo
from constants.constants import AUTH_URL,CLIENT_ID,REDIRECT_URI,CLIENT_SECRET,AUTH_POST_URL,USER_DATA_URL,FRONTEND_BASE_URL
from urllib.parse import urlencode
# Create your views here.

class LoginView(APIView):
    permission_classes = [IsNotAuthenticated]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username,password)
        user = authenticate(request,username=username,password = password)
        
        if user is not None:
            login(request,user)
            return Response({
                'message':'Login Successful',
                'user':{
                    'username' : user.username,
                    'email' : user.email,
                }
                },status = status.HTTP_200_OK)
        else:
            return Response({'error':'Invalide credintials'},status=status.HTTP_401_UNAUTHORIZED)
        
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
    queryset = UserProfile.objects.all()
    # serializer_class = UserProfileSerializer
    lookup_field = 'user__username'
    # permission_classes = [IsNotAuthenticated]
    permission_classes = [IsOwnerOrReadOnly]
    def get_serializer_class(self):
        user = self.request.user
        if user == self.get_object().user:
            return UserProfileSerializer
        return RestrictedUserProfileSerializer
    
    def get_object(self):
        return super().get_object()
    

class ChanneliTokenView(APIView):
    permission_classes = [IsNotAuthenticated]
    def get(self, request,*args, **kwargs):
        # REDIRECT_URL = f"{AUTH_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
        # return redirect(REDIRECT_URL)
        auth_data = {
            'client_id': CLIENT_ID,
            'redirect_uri': REDIRECT_URI,
            'auth_url': AUTH_URL,
        }
        return Response(auth_data,status=status.HTTP_200_OK)

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
        user = getUserInfo(data)

        if type(user)==dict:
            return Response(user,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if user == None:
            return Response({"error":"user_profile don't exist but user do"})
        try:
            login(request,user)
            queryparms = urlencode({
                'username':user.username,
                'status':'success'
            })
            
            return redirect(f"{FRONTEND_BASE_URL}/auth/callback?{queryparms}")
        except:
            return redirect(f"{FRONTEND_BASE_URL}/?error=auth_failed")
        

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
    
class UserDeleteView(generics.DestroyAPIView):
    serializer_class = UserDestroySerializer
    queryset = User.objects.all()
    lookup_field = 'username'
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        self.perform_destroy(user)
        return Response({"details":"user deleted successfully"},status=status.HTTP_204_NO_CONTENT)