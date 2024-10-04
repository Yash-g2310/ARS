import logging
from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Space,SpaceMember
from .serializers import SpaceListSerializer,SpaceCreateDetailSerializer,SpaceInvitation,SendSpaceInvitationSerializer
from .permissions import IsSpaceOwnerOrForbidden
from .utility import send_invite_email
from django.utils import timezone
from django.shortcuts import redirect
from django.conf import settings
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

class SpaceDetailView(generics.RetrieveUpdateAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceCreateDetailSerializer
    lookup_field = 'pk'
    
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