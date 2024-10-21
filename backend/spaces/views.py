import logging
from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Space,SpaceMember,SpaceJoinRequest,SubSpaceMember,SubSpace
from .serializers import SpaceListSerializer,SpaceCreateDetailSerializer,SpaceInvitation,SendSpaceInvitationSerializer,SpaceJoinRequestSerializer,SubSpaceCreateSerializer,SpaceMemberSerializer,SubSpaceListSerializer,SubSpaceDetailUpdateSerializer,SubSpaceMemberSerializer
from .permissions import IsSpaceOwnerOrForbidden
from .utility import send_invite_email
from django.utils import timezone
from django.shortcuts import redirect,get_object_or_404
from django.conf import settings
from django.db import transaction
# Create your views here.
logger = logging.getLogger(__name__)

class SpaceListView(generics.ListAPIView):
    serializer_class = SpaceListSerializer
    def get_queryset(self):
        user = self.request.user
        queryset= Space.objects.filter(owner = user) | Space.objects.filter(spacemember__user = user)
        return queryset.distinct()
    
class SpaceCreateView(generics.CreateAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceCreateDetailSerializer

class SpaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceCreateDetailSerializer
    lookup_field = 'pk'
    
    def destroy(self, request, *args, **kwargs):
        space = self.get_object()
        self.perform_destroy(space)
        return Response({"details":"space deleted successfully"},status=status.HTTP_204_NO_CONTENT)
    
class JoinSpaceRequestView(generics.CreateAPIView):
    serializer_class = SpaceJoinRequestSerializer
    
    def get(self,request,*args, **kwargs):
        user = request.user
        space_token = self.kwargs.get('space_token')
        space = get_object_or_404(Space, space_token=space_token)
        if SpaceMember.objects.filter(space = space, user = user).exists():
            return Response({"detail":"you are already a member of this space"},status=status.HTTP_200_OK)
        if SpaceJoinRequest.objects.filter(space = space, user = user, status = 'pending').exists():
            return Response({"detail":"You have already requested to join this space"},status=status.HTTP_200_OK)
        return Response({"detail":"you can request to join this space"})
    
    def post(self, request, *args, **kwargs):
        space_token = self.kwargs.get('space_token')
        try:
            space = Space.objects.get(space_token = space_token)
        except Space.DoesNotExist:
            return Response({'error':'space not found'},status=status.HTTP_404_NOT_FOUND)
        context = {
            'space':space,
            'user':request.user
        }
        serializer = self.get_serializer(data={},context=context)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        
        return Response({'message':'Your request to join the space has been submitted'},status=status.HTTP_201_CREATED)
    
class AcceptRequestListView(generics.ListAPIView):
    serializer_class = SpaceJoinRequestSerializer
    
    def get_queryset(self):
        space_id = self.kwargs.get('pk')
        queryset = SpaceJoinRequest.objects.filter(space = space_id,status = 'pending')
        return queryset
        
    def get(self,request,*args, **kwargs):
        space_id = self.kwargs.get('pk')
        space = get_object_or_404(Space, id = space_id)
        if space.owner !=request.user:
            return Response({"error":"You do not have permission to access this resource"},status=status.HTTP_403_FORBIDDEN)
        queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset,many= True, context = {
            'username':request.user.username,
            'space_id':space.id,
        })
        return Response(serializer.data)
    
class BaseRequestView(APIView):
    def get_join_request(self,req_id):
        return get_object_or_404(SpaceJoinRequest, id=req_id)
    
    def check_owner(self, join_request,user):
        if join_request.space.owner != user:
            return Response({'error':"you don't have permission to do this action"},status=status.HTTP_403_FORBIDDEN)
        return None
    
class AcceptRequestView(BaseRequestView):
    def post(self,request,req_id,*args, **kwargs):
        join_request = self.get_join_request(req_id)
        permission_response = self.check_owner(join_request,request.user)
        if permission_response:
            return permission_response
        
        with transaction.atomic():
            join_request.status = SpaceJoinRequest.ACCEPTED
            join_request.save()
            SpaceMember.objects.create(space = join_request.space,user = join_request.user)
            join_request.delete()
            
        return Response({"success":"join request accepted"},status=status.HTTP_200_OK)
    
class RejectRequestView(BaseRequestView):
    
    def post(self,request,req_id,*args, **kwargs):
        join_request = self.get_join_request(req_id)
        permission_response = self.check_owner(join_request,request.user)
        if permission_response:
            return permission_response

        with transaction.atomic():
            join_request.status = SpaceJoinRequest.REJECTED
            join_request.save()
            join_request.delete()

        return Response({"success": "Join request rejected"}, status=status.HTTP_200_OK)

class SendSpaceInvitationView(generics.CreateAPIView):
    queryset = SpaceInvitation.objects.all()
    serializer_class = SendSpaceInvitationSerializer
    # permission_classes = [IsSpaceOwnerOrForbidden]
    def not_found(self,message):
        return Response({"error":message},status=status.HTTP_404_NOT_FOUND)
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context.update({'view':self})
        return context
        
    def perform_create(self, serializer):
        print("inside the perform create serializer")
        space_id = self.kwargs.get('pk')
        print(space_id)
        try:
            space = Space.objects.get(id = space_id)
        except Space.DoesNotExist:
            return self.not_found("space not found")
        
        invitation = serializer.save(space = space ,expires_at=timezone.now() + timezone.timedelta(days=2))
        send_invite_email(invitation)
    
class AcceptInvite(APIView):
    def get(self,request,*args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {
                    "error": "You must be logged in to accept an invitation.",
                    "redirect_url": f"{settings.FRONTEND_BASE_URL}login/",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
            
        invite_token = kwargs.get('invite_token',None)
        if not invite_token:
            return Response({"error":"incorrect invite url"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invitation= SpaceInvitation.objects.get(invite_token = invite_token,email = request.user.email)
        except SpaceInvitation.DoesNotExist:
            return Response({"error":"no invitation found"},status=status.HTTP_404_NOT_FOUND)
        
        if invitation.is_expired():
            return Response({"message":"the invitation has expired"},status=status.HTTP_400_BAD_REQUEST)
        try:
            if SpaceMember.objects.filter(space = invitation.space, user = request.user).exists():
                return Response({"message":"you are already the member of this space"},status=status.HTTP_409_CONFLICT)
            
            member = SpaceMember.objects.create(space = invitation.space,user = request.user)
            member.save()
            invitation.delete()
            SpaceInvitation.objects.filter(space = invitation.space, email = request.user.email)
            
            SpaceInvitation
            return Response({"message": "Invite accepted!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"problem in creating user {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SpaceMembersListView(generics.ListAPIView):
    serializer_class = SpaceMemberSerializer
    def get_queryset(self):
        space_id = self.kwargs.get('pk') 
        return SpaceMember.objects.filter(space=space_id)

class SubSpaceCreateView(generics.ListCreateAPIView):
    serializer_class = SubSpaceCreateSerializer
    permission_classes = [IsSpaceOwnerOrForbidden]
    
    def get_queryset(self):
        space_id = self.kwargs.get('pk') 
        return SpaceMember.objects.filter(space=space_id)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        space_id = self.kwargs.get('pk')
        space = get_object_or_404(Space, id=space_id)
        context['space'] = space
        return context
        
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = SpaceMemberSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            sub_space = serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SubSpaceListView(generics.ListAPIView):
    serializer_class = SubSpaceListSerializer
    def get_queryset(self):
        space_id = self.kwargs.get('pk')
        queryset =SubSpace.objects.filter(space = space_id)
        return queryset.distinct()
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['space_id']  = self.kwargs.get('pk')
        return context
    
class SubSpaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubSpaceDetailUpdateSerializer
    lookup_field = 'id'
    queryset = SubSpace.objects.all()
    
    def get_serializer_context(self):
        context =  super().get_serializer_context()
        context['sub_space_id']  = self.kwargs.get('id')
        space_id = self.kwargs.get('pk')
        space = get_object_or_404(Space, id=space_id)
        context['space'] = space
        return context
    
    def destroy(self, request, *args, **kwargs):
        subspace = self.get_object()
        self.perform_destroy(subspace)
        return Response({"details":"space deleted successfully"},status=status.HTTP_204_NO_CONTENT)
    
class SubSpaceMembersListView(generics.ListAPIView):
    serializer_class = SubSpaceMemberSerializer
    def get_queryset(self):
        sub_space_id = self.kwargs.get('id')
        queryset = SubSpaceMember.objects.filter(sub_space=sub_space_id)
        return queryset

