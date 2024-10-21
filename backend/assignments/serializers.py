from rest_framework import serializers
from .models import Assignment,AssignmentDetails,AssignmentSubtask,AssignmentReviewer,AssignmentReviewee,AssignmentTeam,TeamMember
from spaces.models import SubSpaceMember,SubSpace
from spaces.serializers import SubSpaceMemberSerializer
from django.db import transaction
from django.shortcuts import get_object_or_404
from attachments.serializers import AttachmentSerializer
from attachments.models import Attachment


# while updating assignment, we need to pass the id with the attributes which need to be updated.
# since request will always be put so, the attributes which are not found will be deleted
# the attributes without id will be newly created
# need to handle all this in frontend


class AssignmentDetailsSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = AssignmentDetails
        fields = [
            'id',
            'assignment_id',
            'title',
            'description',
        ]
    def get_assignment_id(self,obj):
        return obj.assignment.id if obj.assignment else None

class AssignmentSubtaskSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = AssignmentSubtask
        fields = [
            'id',
            'assignment_id',
            'title',
            'description',
            'tag',
        ]
        extra_kwargs = {
            'tag': {'read_only':True}
        }
        
    def get_assignment_id(self,obj):
        return obj.assignment.id if obj.assignment else None

class AssignmentReviewerSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField(read_only = True)
    reviewer_id = serializers.IntegerField(write_only = True)
    reviewer = SubSpaceMemberSerializer(read_only = True)
    class Meta:
        model = AssignmentReviewer
        fields = [
            'id',
            'assignment_id',
            'reviewer_id',
            "reviewer",
        ]
        extra_kwargs = {
            'reviewer' : {'read_only':True},
        }
        
    def get_assignment_id(self,obj):
        return obj.assignment.id if obj.assignment else None
    
    def validate_reviewer_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if not sub_space_id:
            raise serializers.ValidationError("sub_space_id not in context")
        if not SubSpaceMember.objects.filter(role = SubSpaceMember.REVIEWER,sub_space = sub_space_id, id = val).exists():
            raise serializers.ValidationError('The assignment reviewer must be a member of subspace sub space')
        else: return val

class AssignmentRevieweeSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField(read_only = True)
    reviewee_id = serializers.IntegerField(write_only = True)
    reviewee = SubSpaceMemberSerializer(read_only =True)
    class Meta:
        model = AssignmentReviewee
        fields = [
            'id',
            'assignment_id',
            'reviewee_id',
            'reviewee_status',
            'submission_count',
            'reviewee',
            
        ]
        
        extra_kwargs = {
            'reviewee_status' : {'read_only':True},
        }
        
    def get_assignment_id(self,obj):
        return obj.assignment.id if obj.assignment else None
    
    def validate_reviewee_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if not sub_space_id:
            raise serializers.ValidationError("sub_space_id not in context")
        if not SubSpaceMember.objects.filter(role = SubSpaceMember.REVIEWEE,sub_space = sub_space_id, id = val):
            raise serializers.ValidationError('The assignment reviewee must be a member of subspace sub space')
        else: return val
            
class TeamMemberSerializer(serializers.ModelSerializer):
    team = serializers.PrimaryKeyRelatedField(read_only = True)
    member_id = serializers.IntegerField(write_only = True)
    member = SubSpaceMemberSerializer(read_only=True)
    class Meta:
        model = TeamMember
        fields = [
            'id',
            'team',
            'member_id',
            'member',
        ]
        extra_kwargs = {
            'member' :{'read_only':True}
        }
    
    def validate_member_id(self,val):
        sub_space_id = self.context.get('sub_space_id')
        if sub_space_id is None:
            raise serializers.ValidationError("sub_space_id not in context")
        
        try:
            SubSpaceMember.objects.get(role = SubSpaceMember.REVIEWEE,sub_space = sub_space_id, id = val)
        except SubSpaceMember.DoesNotExist:
            raise serializers.ValidationError('The team member is not a reviewee in sub space')
        except SubSpaceMember.MultipleObjectsReturned:
            raise serializers.ValidationError("Multiple subspace members found, which should not be the case")
        return val
            

class AssignmentTeamSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField(read_only = True)
    members = TeamMemberSerializer(many = True,write_only=True)
    members_list = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = AssignmentTeam
        fields = [
            'id',
            'assignment_id',
            'team_name',
            'team_status',
            'member_count',
            'submission_count',
            'members',
            'members_list',
        ]
        
    def get_assignment_id(self,obj):
        return obj.assignment.id if obj.assignment else None
    
    def create(self, validated_data):
        members_data = validated_data.pop('members',[])
        if not members_data:
            raise serializers.ValidationError("Team with no member is not allowed")
        
        team =AssignmentTeam.objects.create(**validated_data)
        for member_data in members_data:
            member_id = member_data['member_id'] 
            try:
                member = SubSpaceMember.objects.get(id = member_id)
            except SubSpaceMember.DoesNotExist:
                raise serializers.ValidationError(f"There is no subspace member with member id {member_id}")
                
            TeamMember.objects.create(team = team , member = member)
        return team
    
    def get_members_list(self,obj):
        members = obj.teammember_set.all()
        return TeamMemberSerializer(members,many = True).data

class AssignmentCreateSerializer(serializers.ModelSerializer):
    uploader = serializers.PrimaryKeyRelatedField(read_only = True)
    subtasks = AssignmentSubtaskSerializer(many = True,required = False)
    assignment_details = AssignmentDetailsSerializer(many = True,required = False)
    reviewers = AssignmentReviewerSerializer(many = True,write_only = True)
    reviewees = AssignmentRevieweeSerializer(many = True,write_only = True)
    teams = AssignmentTeamSerializer(many = True, required = False)
    attachments = AttachmentSerializer(many = True,required = False)
    sub_space = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Assignment
        fields = [
            'id',
            'uploader',
            'sub_space',
            'title',
            'description',
            'upload_date',
            'iteration_date',
            'due_date',
            'updated_at',
            'visible_to_all',
            'assignment_details',
            'subtasks',
            'reviewers',
            'reviewees',
            'teams',
            'attachments',
        ]

    def validate(self, attrs):
        reviewers = set([rev['reviewer_id'] for rev in attrs['reviewers']])
        reviewees = set([rev['reviewee_id'] for rev in attrs['reviewees']])
        team_members_list = []
        
        for teams in attrs.get('teams',[]):
            for team_member in teams.get('members',[]):
                team_members_list.append(team_member['member_id'])
                
        team_members = set(team_members_list)
        
        if len(team_members) != len(team_members_list):
            raise serializers.ValidationError("There are some team members which are repeated accross the Assignment teams")
        
        if team_members & reviewees:
            raise serializers.ValidationError("Team members and reviewees should not overlap")
        
        if reviewers & team_members:
            raise serializers.ValidationError("Team members and reviewers should not overlap")
        
        if reviewers & reviewees:
            raise serializers.ValidationError("Reviewers and reviewees cannot overlap.")
        

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        sub_space_id = self.context.get('sub_space_id')
        if (not request) or (not sub_space_id) :
            raise serializers.ValidationError("problem in getting context parameters while creating assignment")
        sub_space =SubSpace.objects.get(id = sub_space_id) 
        user = request.user
        if not user ==sub_space.space.owner:
            try:
                sub_space_member = SubSpaceMember.objects.get(sub_space = sub_space_id, space_member__user = user,role = SubSpaceMember.REVIEWER)
            except SubSpaceMember.DoesNotExist:
                raise serializers.ValidationError("user is not a reviewer in this subspace")
            validated_data['uploader'] = sub_space_member
        else:
            owner = SubSpaceMember.objects.filter(role = SubSpaceMember.OWNER).first()
            validated_data['uploader'] = owner
            
        
        validated_data['sub_space'] = sub_space
        assignment_details_data = validated_data.pop('assignment_details',[])
        subtasks_data = validated_data.pop('subtasks',[])
        reviewers_data = validated_data.pop('reviewers',[])
        reviewees_data = validated_data.pop('reviewees',[])
        teams_data = validated_data.pop('teams',[])
        attachments_data = validated_data.pop('attachments',[])

        with transaction.atomic():
            assignment = Assignment.objects.create(**validated_data)

            # Create details
            for detail_data in assignment_details_data:
                AssignmentDetails.objects.create(assignment=assignment, **detail_data)

            # Create subtasks
            for subtask_data in subtasks_data:
                AssignmentSubtask.objects.create(assignment=assignment, **subtask_data)

            # Create reviewers
            for reviewer_data in reviewers_data:
                AssignmentReviewer.objects.create(assignment=assignment, reviewer_id=reviewer_data['reviewer_id'])

            # Create reviewees
            for reviewee_data in reviewees_data:
                AssignmentReviewee.objects.create(
                    assignment=assignment, 
                    reviewee_id=reviewee_data['reviewee_id'],
                    reviewee_status=reviewee_data.get('reviewee_status', AssignmentReviewee.NOT_SUBMITTED)
                )

            # Create teams
            for team_data in teams_data:
                members_data = team_data.pop('members',[])
                team = AssignmentTeam.objects.create(assignment=assignment, **team_data)
                for member_data in members_data:
                    TeamMember.objects.create(team = team, **member_data)

            # Create attachments
            for attachment_data in attachments_data:
                Attachment.objects.create(assignment = assignment,file = attachment_data)

        return assignment

class AssignmentListSerializer(serializers.ModelSerializer):
    assignment_id = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    class Meta:
        model = Assignment
        fields = [
            'assignment_id',
            'title',
            'upload_date',
            'subtask_count',
            'reviewer_count',
            'reviewee_count',
            'team_count',
            'role',
        ]
    def get_assignment_id(self,obj):
        return obj.id
    def get_role(self,obj):
        sub_space_member = self.context.get('sub_space_member')
        if not sub_space_member:
            raise serializers.ValidationError("subspace member is not passed in context")
        if AssignmentReviewee.objects.filter(assignment =obj,reviewee=sub_space_member).exists():
            return SubSpaceMember.REVIEWEE
        elif AssignmentReviewer.objects.filter(assignment =obj,reviewer=sub_space_member).exists():
            return SubSpaceMember.REVIEWER
        elif TeamMember.objects.filter(team__assignment= obj,member = sub_space_member).exists():
            return 'team'
        return "not part of this assignment"
    
class AssignmentRetrieveUpdateSerializer(AssignmentCreateSerializer):
    subtask_list = serializers.SerializerMethodField(read_only = True)
    assignment_detail_list = serializers.SerializerMethodField(read_only = True)
    reviewers_list = serializers.SerializerMethodField(read_only = True)
    reviewees_list = serializers.SerializerMethodField(read_only = True)
    teams_list = serializers.SerializerMethodField(read_only = True)
    attachment_list = serializers.SerializerMethodField(read_only = True)
    
    class Meta(AssignmentCreateSerializer.Meta):
        model = Assignment
        fields = AssignmentCreateSerializer.Meta.fields + [
            'subtask_count',
            'reviewer_count',
            'reviewee_count',
            'assignment_detail_list',
            'subtask_list',
            'reviewers_list',
            'reviewees_list',
            'teams_list',
            'attachment_list',
        ]
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance is not None:
            self.fields.pop('uploader',None)
    
    def get_subtask_list(self,obj):
        subtasks = obj.assignmentsubtask_set.all()
        return AssignmentSubtaskSerializer(subtasks,many = True).data
    
    def get_assignment_detail_list(self,obj):
        assignment_details = obj.assignmentdetails_set.all()
        return AssignmentDetailsSerializer(assignment_details,many = True).data
    
    def get_reviewers_list(self,obj):
        reviewers = obj.assignmentreviewer_set.all()
        return AssignmentReviewerSerializer(reviewers,many =True).data
    
    def get_reviewees_list(self,obj):
        reviewees = obj.assignmentreviewee_set.all()
        return AssignmentRevieweeSerializer(reviewees,many = True).data
    
    def get_teams_list(self,obj):
        teams = obj.assignmentteam_set.all()
        return AssignmentTeamSerializer(teams,many =True).data
    
    def get_attachment_list(self,obj):
        teams = obj.attachment_set.all()
        return AttachmentSerializer(teams,many =True).data
    
    def update(self, instance, validated_data):
        uploader = validated_data.get('uploader',None)
        if uploader is not None:
            raise serializers.ValidationError("You can't update this field")
        
        request_data = self.context['request'].data

        
        assignment_details_data = validated_data.pop('assignment_details',[])
        for i  in range (len(request_data.get('assignment_details'))):
            if request_data.get('assignment_details')[i].get('id'):
                assignment_details_data[i]['id'] = request_data.get('assignment_details')[i].get('id')

        
        subtasks_data = validated_data.pop('subtasks',[])
        for i  in range (len(request_data.get('subtasks'))):
            if request_data.get('subtasks')[i].get('id'):
                subtasks_data[i]['id'] = request_data.get('subtasks')[i].get('id')

                
        reviewers_data = validated_data.pop('reviewers',[])
        for i  in range (len(request_data.get('reviewers'))):
            if request_data.get('reviewers')[i].get('id'):
                reviewers_data[i]['id'] = request_data.get('reviewers')[i].get('id')

        reviewees_data = validated_data.pop('reviewees',[])
        for i  in range (len(request_data.get('reviewees'))):
            if request_data.get('reviewees')[i].get('id'):
                reviewees_data[i]['id'] = request_data.get('reviewees')[i].get('id')
                
        teams_data = validated_data.pop('teams',[])
        for i  in range (len(request_data.get('teams'))):
            if request_data.get('teams')[i].get('id'):
                teams_data[i]['id'] = request_data.get('teams')[i].get('id')
        
        instance.title = validated_data.get('title',instance.title) # 'title',
        instance.description = validated_data.get('description',instance.description) # 'description',
        instance.iteration_date = validated_data.get('iteration_date',instance.iteration_date) # 'iteration_date',
        instance.due_date = validated_data.get('due_date',instance.due_date) # 'due_date',
        
        if assignment_details_data:
            self.update_related_fields(instance,assignment_details_data,AssignmentDetails,instance.assignmentdetails_set.all())
        if subtasks_data:
            self.update_related_fields(instance,subtasks_data,AssignmentSubtask,instance.assignmentsubtask_set.all())
            
        if reviewers_data:
            self.update_assignment_members(instance,reviewers_data,AssignmentReviewer,instance.assignmentreviewer_set.all())
        if reviewees_data:
            self.update_assignment_members(instance,reviewees_data,AssignmentReviewee,instance.assignmentreviewee_set.all())
            
        if teams_data:
            self.update_assignment_teams(instance,teams_data)
        
        instance.save()
        return instance

    def update_related_fields(self,assignment,data,model,curr_data):
        current_ids = {instance.get('id') for instance in data if instance.get('id') is not None}
        existing_id = set(curr_data.values_list('id',flat = True))
        
        ids_to_delete = existing_id - current_ids
        
        if ids_to_delete:
            model.objects.filter(id__in = ids_to_delete).delete()
        
        
        for instance in data:
            instance_id = instance.get('id')
            if instance_id:
                model_instance = get_object_or_404(model, id=instance_id, assignment=assignment)
                for key, val in instance.items():
                    if key == 'id': continue
                    setattr(model_instance, key, val)
                model_instance.save()
            else:
                new_instance = model(assignment=assignment, **instance)
                new_instance.save() 
                
    def update_assignment_members(self,assignment,data,model,curr_data):
        current_ids = {instance.get('id') for instance in data if instance.get('id') is not None}
        existing_id = set(curr_data.values_list('id', flat=True))
        
        ids_to_delete = existing_id - current_ids
        if ids_to_delete:
            model.objects.filter(id__in=ids_to_delete).delete()

        for instance in data:
            instance_id = instance.get('id')
            if instance_id is None:
                new_instance = model(assignment=assignment, **instance)
                new_instance.save()

    def update_assignment_teams(self,assignment,teams_data):
        current_team_ids = {team_data.get('id') for team_data in teams_data if team_data.get('id')}
        existing_team_ids = set(assignment.assignmentteam_set.values_list('id', flat=True))
        ids_to_delete = existing_team_ids - current_team_ids
        
        if ids_to_delete:
            AssignmentTeam.objects.filter(id__in=ids_to_delete).delete()
            
        TeamMember.objects.filter(team__assignment=assignment).delete()

        for team_data in teams_data:
            members_data = team_data.pop('members', [])
            team_id = team_data.get('id')

            if team_id:
                team = AssignmentTeam.objects.get(id=team_id, assignment=assignment)
                for attr, value in team_data.items():
                    setattr(team, attr, value)
                team.save()
            else:
                team = AssignmentTeam.objects.create(assignment=assignment, **team_data)

            for member_data in members_data:
                TeamMember.objects.create(team=team, **member_data)
                
class AssignmentMemberSerializer(serializers.ModelSerializer):
    assignment_reviewers = serializers.SerializerMethodField()
    assignment_reviewees = serializers.SerializerMethodField()
    assignment_teams = serializers.SerializerMethodField()
    class Meta:
        model = Assignment
        fields = ['assignment_reviewers','assignment_reviewees','assignment_teams',]
        
    def get_assignment_reviewers(self,obj):
        reviewers = obj.assignmentreviewer_set.all()
        return AssignmentReviewerSerializer(reviewers,many =True).data
    
    def get_assignment_reviewees(self,obj):
        reviewees = obj.assignmentreviewee_set.all()
        return AssignmentRevieweeSerializer(reviewees,many = True).data
    
    def get_assignment_teams(self,obj):
        teams = obj.assignmentteam_set.all()
        return AssignmentTeamSerializer(teams,many =True).data