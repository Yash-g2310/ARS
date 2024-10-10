from rest_framework import serializers
from .models import Space, SpaceMember, SubSpace, SubSpaceMember, SpaceInvitation, SpaceJoinRequest
from django.urls import reverse
from urllib.parse import urljoin
from django.conf import settings
from users.serializers import UserSerializer

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
    
class SpaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = SpaceMember
        fields = ['space','user',]
        

class SubSpaceMemberSerializer(serializers.ModelSerializer):
    space_member_id = serializers.PrimaryKeyRelatedField(queryset = SpaceMember.objects.all())
    username = serializers.CharField(source='space_member.user.username', read_only=True)
    class Meta:
        model = SubSpaceMember
        fields = ['id','space_member_id','username','join_date','role',]
    

class SubSpaceCreateSerializer(serializers.ModelSerializer):
    reviewers = serializers.PrimaryKeyRelatedField(many=True, queryset=SpaceMember.objects.all(), write_only=True)
    reviewees = serializers.PrimaryKeyRelatedField(many=True, queryset=SpaceMember.objects.all(), write_only=True)

    class Meta:
        model = SubSpace
        fields = [
            'sub_space_name',
            'sub_space_bio',
            'reviewers',
            'reviewees',
        ]

    def validate(self, data):
        reviewers = data.get('reviewers', [])
        reviewees = data.get('reviewees', [])
        space = self.context['space']

        for member in reviewers + reviewees:
            if member.space != space:
                raise serializers.ValidationError("All reviewers and reviewees must be members of the space.")

        reviewer_ids = {member.id for member in reviewers}
        reviewee_ids = {member.id for member in reviewees}
        if reviewer_ids & reviewee_ids:
            raise serializers.ValidationError("Reviewers and reviewees cannot overlap.")

        return data

    def create(self, validated_data):
        reviewers = validated_data.pop('reviewers')
        reviewees = validated_data.pop('reviewees')
        space = self.context['space']  

        sub_space = SubSpace.objects.create(
            space=space,
            sub_space_name=validated_data['sub_space_name'],
            sub_space_bio=validated_data.get('sub_space_bio', '')
        )

        for reviewer in reviewers:
            SubSpaceMember.objects.create(
                space_member=reviewer,
                sub_space=sub_space,
                role=SubSpaceMember.REVIEWER
            )
        
        for reviewee in reviewees:
            SubSpaceMember.objects.create(
                space_member=reviewee,
                sub_space=sub_space,
                role=SubSpaceMember.REVIEWEE
            )

        return sub_space
    
class SubSpaceListSerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    class Meta:
        model = SubSpace
        fields = ['id','sub_space_name','sub_space_bio','create_date','is_member']
        
    def get_is_member(self,obj):
        request = self.context.get('request')
        user = request.user
        space_id = self.context.get('space_id')
        try:
            space_member = SpaceMember.objects.get(user = user,space = space_id)
        except SpaceMember.DoesNotExist:
            raise serializers.ValidationError("the user is not member of the space")
        return SubSpaceMember.objects.filter(sub_space= obj, space_member = space_member).exists()


class SubSpaceDetailUpdateSerializer(SubSpaceCreateSerializer):
    reviewers_list = serializers.SerializerMethodField()
    reviewees_list = serializers.SerializerMethodField()
    sub_space_id = serializers.SerializerMethodField()
    space = serializers.PrimaryKeyRelatedField(read_only = True)
    space_name = serializers.CharField(source='space.space_name', read_only = True)
    class Meta(SubSpaceCreateSerializer.Meta):
        fields = SubSpaceCreateSerializer.Meta.fields + ['sub_space_id','space','space_name','sub_space_name','sub_space_bio','create_date','reviewer_count','reviewee_count','group_count','reviewers_list','reviewees_list','reviewers','reviewees']
        
    def get_sub_space_id(self,obj):
        return obj.id
    
    def get_reviewers_list(self,obj):
        reviewers = SubSpaceMember.objects.filter(sub_space = obj,role = SubSpaceMember.REVIEWER)
        return SubSpaceMemberSerializer(reviewers,many = True).data
    
    def get_reviewees_list(self,obj):
        reviewees = SubSpaceMember.objects.filter(sub_space = obj,role = SubSpaceMember.REVIEWEE)
        return SubSpaceMemberSerializer(reviewees,many = True).data
    
    def update(self, instance, validated_data):
        reviewers = validated_data.pop('reviewers',[])
        reviewees = validated_data.pop('reviewees',[])
        
        current_reviewers = SubSpaceMember.objects.filter(sub_space = instance,role =SubSpaceMember.REVIEWER)
        current_reviewers_ids = set(current_reviewers.values_list('space_member_id',flat=True))
        new_reviewers_ids = set(member.id for member in reviewers)
        
        reviewers_to_delete = current_reviewers.exclude(space_member_id__in = new_reviewers_ids)
        reviewers_to_delete.delete()
        
        current_reviewees = SubSpaceMember.objects.filter(sub_space = instance,role =SubSpaceMember.REVIEWEE)
        current_reviewees_ids = set(current_reviewees.values_list('space_member_id',flat=True))
        new_reviewees_ids = set(member.id for member in reviewees)
        
        reviewees_to_delete = current_reviewees.exclude(space_member_id__in = new_reviewees_ids)
        reviewees_to_delete.delete()
        
        for reviewer in reviewers:
            if reviewer.id not in current_reviewers_ids:
                SubSpaceMember.objects.create(sub_space = instance, space_member = reviewer,role = SubSpaceMember.REVIEWER)
        
        for reviewee in reviewees:
            if reviewee.id not in current_reviewees_ids:
                SubSpaceMember.objects.create(sub_space = instance, space_member = reviewee,role = SubSpaceMember.REVIEWEE)
        
        instance.sub_space_name = validated_data.get('sub_space_name', instance.sub_space_name)
        instance.sub_space_bio = validated_data.get('sub_space_bio', instance.sub_space_bio)
        instance.save()
        
        return instance
    
