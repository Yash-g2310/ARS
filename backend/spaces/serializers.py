from rest_framework import serializers
from .models import Space, SpaceMember, SubSpace, SubSpaceMember

class SpaceMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceMember
        fields = ['user', 'join_date']

class SubSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSpace
        fields = ['id', 'sub_space_name', 'sub_space_bio', 'create_date']

class SpaceDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    sub_space_count = serializers.IntegerField(source='sub_space_count', read_only=True)

    class Meta:
        model = Space
        fields = ['id', 'space_name', 'space_bio', 'create_date', 'space_profile', 'space_background', 'members', 'sub_space_count']

    def get_members(self, obj):
        members = SpaceMember.objects.filter(space=obj)
        return SpaceMemberSerializer(members, many=True).data

class UserSubSpaceSerializer(serializers.ModelSerializer):
    sub_spaces = serializers.SerializerMethodField()

    class Meta:
        model = SubSpaceMember
        fields = ['sub_space', 'sub_spaces']

    def get_sub_spaces(self, obj):
        sub_spaces = SubSpace.objects.filter(subspacemember__space_member__user=obj.space_member.user)
        return SubSpaceSerializer(sub_spaces, many=True).data
