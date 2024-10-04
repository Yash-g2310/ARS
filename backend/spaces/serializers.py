from rest_framework import serializers
from .models import Space, SpaceMember, SubSpace, SubSpaceMember, SpaceInvitation

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
    class Meta:
        model = Space
        fields = [
            'id',
            'owner',
            'space_name',
            'space_bio',
            'create_date',
            'space_profile',
            'space_background',
            'member_count',
            'sub_space_count',
            'space_members',
            'sub_spaces'
        ]

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
    
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
        
    #     if self.context['view'].action == 'retrieve':
    #         pass
    #     return representation
            

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
        # try:
        #     space = Space.objects.get(id=space_id)
        # except Space.DoesNotExist:
        #     raise serializers.ValidationError("The space does not exist.")
        
        email = data.get('email')
        if not email :
            raise serializers.ValidationError("email not found")
        
        print(space_id,email)
        if SpaceMember.objects.filter(space = space_id,user__email = email).exists():
            raise serializers.ValidationError(f'user with email {email} is already a part of the space')
        
        return data

# class SubSpaceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SubSpace
#         fields = ['id', 'sub_space_name', 'sub_space_bio', 'create_date']


#     class Meta:
#         model = Space
#         fields = ['id', 'space_name', 'space_bio', 'create_date', 'space_profile', 'space_background', 'members', 'sub_space_count']

#     def get_members(self, obj):
#         members = SpaceMember.objects.filter(space=obj)
#         return SpaceMemberSerializer(members, many=True).data

# class UserSubSpaceSerializer(serializers.ModelSerializer):
#     sub_spaces = serializers.SerializerMethodField()

#     class Meta:
#         model = SubSpaceMember
#         fields = ['sub_space', 'sub_spaces']

#     def get_sub_spaces(self, obj):
#         sub_spaces = SubSpace.objects.filter(subspacemember__space_member__user=obj.space_member.user)
#         return SubSpaceSerializer(sub_spaces, many=True).data
