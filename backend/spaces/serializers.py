from rest_framework import serializers
from .models import Space, SpaceMember, SubSpace, SubSpaceMember, SpaceInvitation, SpaceJoinRequest
from django.urls import reverse
from urllib.parse import urljoin
from django.conf import settings

class SpaceListSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    class Meta:
        model = Space
        fields = [
            'id',
            'space_name',
            'space_profile',
            'is_owner',
        ]

    def get_is_owner(self,obj):
        request = self.context.get('request')
        return obj.owner == request.user if request and request.user.is_authenticated else False

class SpaceCreateDetailSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default = serializers.CurrentUserDefault())
    space_members = serializers.SerializerMethodField()
    sub_spaces = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()
    class Meta:
        model = Space
        fields = [
            'id',
            'owner',
            'owner_username',
            'space_name',
            'space_bio',
            'create_date',
            'space_profile',
            'space_background',
            'member_count',
            'sub_space_count',
            'space_members',
            'sub_spaces',
            'get_join_url',
        ]

    def get_owner_username(self,obj):
        return obj.owner.username
    
    def create(self, validated_data):
        space = super().create(validated_data)
        SpaceMember.objects.create(space = space,  user = validated_data['owner'])
        return space

    def get_space_members(self,obj):
        if self.context['request'].method == 'GET':
            return [{'space_member_id':member.id, 'space_member_username':member.user.username} for member in obj.spacemember_set.all()]
        else:
            return []

    def get_sub_spaces(self,obj):
        if self.context['request'].method == 'GET':
            return [{'subspace_id':subspace.id,'subspace_name':subspace.sub_space_name,} for subspace in obj.subspace_set.all()]
        else:
            return []
            

class SpaceJoinRequestSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    accept_url = serializers.SerializerMethodField()
    reject_url = serializers.SerializerMethodField()
    class Meta:
        model = SpaceJoinRequest
        fields = ['space','user','username','created_at','status','accept_url','reject_url']
        read_only_fields =  ['space','user','created_at','status',]
        
    def get_dict(self,obj):
        username = self.context.get('username')
        if not username:
            raise serializers.ValidationError("username not found")
        space_id = self.context.get('space_id')
        if not space_id:
            raise serializers.ValidationError('space id not found')
        return {'req_id':obj.id,'pk':space_id,'username':username}
    
    def get_username(self,obj):
        return obj.user.username
    
    def get_accept_url(self,obj):
        accept_url = reverse('spaces:accept_request',kwargs=self.get_dict(obj))
        return urljoin(settings.FRONTEND_BASE_URL +'/',accept_url)
    
    def get_reject_url(self,obj):
        reject_url = reverse('spaces:reject_request',kwargs=self.get_dict(obj))
        return urljoin(settings.FRONTEND_BASE_URL +'/',reject_url)
    
    def create(self, validated_data):
        validated_data['space'] = self.context['space']
        validated_data['user'] = self.context['user']
        return SpaceJoinRequest.objects.create(**validated_data)

class SendSpaceInvitationSerializer(serializers.ModelSerializer):
    invited_by = serializers.CharField(source='space.owner', read_only = True)
    class Meta:
        model = SpaceInvitation
        fields  =[
            'email',
            'invite_token',
            'invited_by',
            'created_at',
            'message_by_owner'
        ]
        read_only = ['invite_token','invited_by','created_at']
        
    def validate(self,data):
        
        space_id = self.context.get('view').kwargs.get('pk')
        if not space_id:
            raise serializers.ValidationError("space id is not present")
        
        email = data.get('email')
        if not email :
            raise serializers.ValidationError("email not found")
        
        print(space_id,email)
        if SpaceMember.objects.filter(space = space_id,user__email = email).exists():
            raise serializers.ValidationError(f'user with email {email} is already a part of the space')
        
        return data
    
class SubSpaceMemberSerializer(serializers.ModelSerializer):
    space_member_id = serializers.PrimaryKeyRelatedField(queryset = SpaceMember.objects.all())
    username = serializers.CharField(source='space_member.user.username', read_only=True)
    class Meta:
        model = SubSpaceMember
        fields = ['space_member_id','username','join_date','role',]
    

class SubSpaceCreationSerializer(serializers.ModelSerializer):
    reviewers = serializers.PrimaryKeyRelatedField(many = True,queryset = SpaceMember.objects.none())
    reviewees = serializers.PrimaryKeyRelatedField(many = True,queryset = SpaceMember.objects.none())
    class Meta:
        model = SubSpace
        fields = [
                'sub_space_name',
                'sub_space_bio',
                'reviewers',
                'reviewees',
            ]
    def __init__(self,*args, **kwargs):
        self.space_id = kwargs.pop('space_id')
        super().__init__(*args, **kwargs)
        if self.space_id:
            self.fields['reviewers'].queryset = SpaceMember.objects.filter(space = self.space_id)
            self.fields['reviewees'].queryset = SpaceMember.objects.filter(space = self.space_id)
        else:
            raise serializers.ValidationError("space id not found")
        print("Reviewers queryset:", self.fields['reviewers'].queryset)
        print("Reviewees queryset:", self.fields['reviewees'].queryset)
        
    def get_reviewers_queryset(self):
        return SpaceMember.objects.filter(space=self.space_id)

    def get_reviewees_queryset(self):
        return SpaceMember.objects.filter(space=self.space_id)
