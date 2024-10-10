from rest_framework import serializers
from .models import Assignment,AssignmentDetails,AssignmentSubtask,AssignmentReviewer,AssignmentReviewee,AssignmentTeam,TeamMember
from spaces.models import SubSpaceMember,SubSpace
from django.db import transaction

class AssignmentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentDetails
        fields = [
            # 'assignment',
            'title',
            'description',
        ]

class AssignmentSubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubtask
        fields = [
            # 'assignment',
            'title',
            'description',
            'tag',
        ]

class AssignmentReviewerSerializer(serializers.ModelSerializer):
    reviewer_id = serializers.IntegerField()
    class Meta:
        model = AssignmentReviewer
        fields = [
            # 'assignment',
            'reviewer_id',
        ]
    def validate_reviewer_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if not sub_space_id:
            return serializers.ValidationError("sub_space_id not in context")
        if not SubSpaceMember.objects.filter(role = SubSpaceMember.REVIEWER,sub_space = sub_space_id, id = val).exists():
            return serializers.ValidationError('The assignment reviewer must be a member of subspace sub space')
        else: return val

class AssignmentRevieweeSerializer(serializers.ModelSerializer):
    reviewee_id = serializers.IntegerField()
    class Meta:
        model = AssignmentReviewee
        fields = [
            # 'assignment',
            'reviewee_id',
            # 'reviewee_status',
            # 'submission_count'
        ]
    def validate_reviewee_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if not sub_space_id:
            return serializers.ValidationError("sub_space_id not in context")
        if not SubSpaceMember.objects.filter(role = SubSpaceMember.REVIEWEE,sub_space = sub_space_id, id = val):
            return serializers.ValidationError('The assignment reviewee must be a member of subspace sub space')
        else: return val
            
class TeamMemberSerializer(serializers.ModelSerializer):
    team = serializers.PrimaryKeyRelatedField(read_only = True)
    member_id = serializers.IntegerField()
    class Meta:
        model = TeamMember
        fields = [
            'team',
            'member_id',
        ]
    def validate_member_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if not sub_space_id:
            return serializers.ValidationError("sub_space_id not in context")
        if not SubSpaceMember.objects.filter(role = SubSpaceMember.REVIEWEE,sub_space = sub_space_id, id = val):
            return serializers.ValidationError('The team member is not a reviewee in sub space')
        else: return val
        
    def validate(self, attrs):
        member_id = attrs.get(member_id)
        team = attrs.get(team)
        if (not member_id) or (not team):
            return serializers.ValidationError("team or member_id not available")
        if TeamMember.objects.filter(member__id =member_id,team__assignment =team.assignment).exists():
            return serializers.ValidationError("The reviewee is already is part of a team")
        
        return super().validate(attrs)
        

class AssignmentTeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many = True)
    class Meta:
        model = AssignmentTeam
        fields = [
            # 'assignment',
            'team_name',
            'member_count',
            'submission_count',
            'members',
        ]
    def create(self, validated_data):
        members_data = validated_data.pop('members',[])
        if not members_data:
            raise serializers.ValidationError("Team with no member is not allowed")
        team =AssignmentTeam.objects.create(**validated_data)
        for member_data in members_data:
            TeamMember.objects.create(team = team , member_id = member_data['member_id'])
        return team

class AssignmentCreateSerializer(serializers.ModelSerializer):
    uploader = serializers.PrimaryKeyRelatedField(read_only = True)
    subtasks = AssignmentSubtaskSerializer(many = True,write_only = True)
    assignment_details = AssignmentDetailsSerializer(many = True,write_only = True)
    reviewers = AssignmentReviewerSerializer(many = True,write_only = True)
    reviewees = AssignmentRevieweeSerializer(many = True,write_only = True)
    teams = AssignmentTeamSerializer(many = True,write_only = True)
    sub_space = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Assignment
        fields = [
            'uploader',
            'sub_space',
            'title',
            'description',
            'upload_date',
            'iteration_date',
            'due_date',
            'updated_at',
            'subtask_count',
            'assignment_details',
            'subtasks',
            'reviewers',
            'reviewees',
            'teams',
        ]
    def create(self, validated_data):
        request = self.context.get("request")
        sub_space_id = self.context.get('sub_space_id')
        if (not request) or (not sub_space_id) :
            raise serializers.ValidationError("problem in getting context parameters")

        user = request.user
        try:
            sub_space_member = SubSpaceMember.objects.get(sub_space = sub_space_id, space_member__user = user,role = SubSpaceMember.REVIEWER)
        except SubSpaceMember.DoesNotExist:
            raise serializers.ValidationError("user is not a reviewer in this subspace")
        
        validated_data['uploader'] = sub_space_member
        validated_data['sub_space'] = SubSpace.objects.get(id = sub_space_id)
        
        assignment_details_data = validated_data.pop('assignment_details')
        subtasks_data = validated_data.pop('subtasks')
        reviewers_data = validated_data.pop('reviewers')
        reviewees_data = validated_data.pop('reviewees')
        teams_data = validated_data.pop('teams')
        print("__________________________________________-")
        print(assignment_details_data)
        print("__________________________________________-")
        print(subtasks_data)
        print("__________________________________________-")
        print(reviewers_data)
        print("__________________________________________-")
        print(reviewees_data)
        print("__________________________________________-")
        print(teams_data)
        print("__________________________________________-")
        print(validated_data)

        with transaction.atomic():
            assignment = Assignment.objects.create(**validated_data)

            # Create details
            for detail_data in assignment_details_data:
                AssignmentDetails.objects.create(assignment=assignment, **detail_data)

            # Create subtasks
            for subtask_data in subtasks_data:
                AssignmentSubtask.objects.create(assignment=assignment, **subtask_data)

            print("__________________________________________-std")
            # Create reviewers
            for reviewer_data in reviewers_data:
                AssignmentReviewer.objects.create(assignment=assignment, reviewer_id=reviewer_data['reviewer_id'])

            print("__________________________________________-revrd")
            # Create reviewees
            for reviewee_data in reviewees_data:
                AssignmentReviewee.objects.create(
                    assignment=assignment, 
                    reviewee_id=reviewee_data['reviewee_id'],
                    reviewee_status=reviewee_data.get('reviewee_status', 'not_submitted')
                )

            print("__________________________________________-reveed")
            # Create teams
            for team_data in teams_data:
                members_data = team_data.pop('members')
                team = AssignmentTeam.objects.create(assignment=assignment, **team_data)
                for member_data in members_data:
                    TeamMember.objects.create(team=team, member_id=member_data['member_id'])

            print("__________________________________________-teamd")
        return assignment

    def validate(self, attrs):
        reviewers = set([rev['reviewer_id'] for rev in attrs['reviewers']])
        reviewees = set([rev['reviewee_id'] for rev in attrs['reviewees']])
        # Ensure reviewers and reviewees do not overlap
        if reviewers & reviewees:
            raise serializers.ValidationError("Reviewers and reviewees cannot overlap.")

        return attrs