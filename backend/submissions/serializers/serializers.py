from rest_framework import serializers
from submissions.models import AssignmentReviewee,AssignmentSubmission,AssignmentTeam,SubtaskStatus,SubtaskSubmission,AssignmentSubtask
from assignments.models import Assignment
from django.db import transaction


class AssignmentRevieweeStatusSerializer(serializers.ModelSerializer):
    assignment_reviewee = serializers.CharField(source= 'reviewee.space_member.user.username',read_only = True)
    class Meta:
        model = AssignmentReviewee
        fields = ['assignment_reviewee','reviewee_status']
        
class AssignmentTeamStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentTeam
        fields = ['team_name','team_status']

class AssignmentStatusSerializer(serializers.ModelSerializer):
    reviewees_status = serializers.SerializerMethodField()
    teams_status = serializers.SerializerMethodField()
    class Meta:
        model = Assignment
        fields =['id','reviewees_status','teams_status']

    def get_reviewees_status(self,obj):
        reviewees = obj.assignmentreviewee_set.all()
        return AssignmentRevieweeStatusSerializer(reviewees,many = True).data

    def get_teams_status(self,obj):
        teams = obj.assignmentteam_set.all()
        return AssignmentTeamStatusSerializer(teams,many = True).data
    
class SubtaskSubmitSerializer(serializers.ModelSerializer):
    assignment_subtask_id = serializers.PrimaryKeyRelatedField(queryset = AssignmentSubtask.objects.all())
    class Meta:
        model = SubtaskSubmission
        fields = [
            'id',
            'assignment_subtask_id',
            'reviewee_comment',
        ]
    
class AssignmentSubmitSerializer(serializers.ModelSerializer):
    subtask_comments = SubtaskSubmitSerializer(many = True,write_only = True)

    class Meta:
        model = AssignmentSubmission
        fields = [
            'id',
            'submitted_at',
            'status',
            'reviewee_comment',
            'subtask_comments',
        ]
        extra_kwargs = {
            'status':{'read_only':True},
        }
    def validate(self, attrs):
        assignment_reviewee = self.context.get('assignment_reviewee',None)
        assignment_team = self.context.get('assignment_team',None)
        
        if not (assignment_reviewee or assignment_team):
            raise serializers.ValidationError("atleast one of assignment reviewee or assignment team must be provided")
        elif assignment_reviewee and assignment_team:
            raise serializers.ValidationError("both assignment reviewee and assignment team must not be provided")
        
        assignment = self.get_assignment(assignment_reviewee,assignment_team)
        
        substask_comments = attrs.get('subtask_comments',[])
        
        for subtask_comment in substask_comments:
            subtask = subtask_comment.get('assignment_subtask_id')
            if not subtask:
                raise serializers.ValidationError(f"The Subtask with id {subtask} does not exist")
            if subtask.assignment != assignment:
                raise serializers.ValidationError("The subtask is not the part of assignment that is submitted")
        return attrs
    
    def get_assignment(self, assignment_reviewee_id, assignment_team_id):
        """
        Helper method to get the assignment based on either the assignment_reviewee or assignment_team.
        """
        if assignment_reviewee_id:
            try:
                return AssignmentReviewee.objects.get(id=assignment_reviewee_id).assignment
            except AssignmentReviewee.DoesNotExist:
                raise serializers.ValidationError("The assignment reviewee does not exist.")
        elif assignment_team_id:
            try:
                return AssignmentTeam.objects.get(id=assignment_team_id).assignment
            except AssignmentTeam.DoesNotExist:
                raise serializers.ValidationError("The assignment team does not exist.")
    
    def create(self, validated_data):
        
        assignment_reviewee_id = self.context.get('assignment_reviewee')
        assignment_team_id = self.context.get('assignment_team')
        if assignment_reviewee_id:
            assignment_reviewee = AssignmentReviewee.objects.filter(id = assignment_reviewee_id).first()
            validated_data['assignment_reviewee'] = assignment_reviewee
        if assignment_team_id:
            assignment_team = AssignmentTeam.objects.filter(id = assignment_team_id).first()
            validated_data['assignment_team'] = assignment_team
        
        subtask_comments_data = validated_data.pop('subtask_comments',[])
        with transaction.atomic():
            assignment_submission = super().create(validated_data)
            for subtask_data in subtask_comments_data:
                SubtaskSubmission.objects.create(
                    assignment_submission = assignment_submission,
                    assignment_subtask = subtask_data.get('assignment_subtask_id'),
                    reviewee_comment = subtask_data.get('reviewee_comment'),
                )
        return assignment_submission
                

class SubmissionListSerializer(serializers.ModelSerializer):
    team_name = serializers.SerializerMethodField()
    reviewee_name = serializers.SerializerMethodField()
    class Meta:
        model = AssignmentSubmission
        fields = [
            'id',
            'team_name',
            'reviewee_name',
            'status',
        ]
    def get_team_name(self,obj):
        if obj.assignment_team:
            return obj.assignment_team.team_name
        return ""
    def get_reviewee_name(self,obj):
        if obj.assignment_reviewee:
            return obj.assignment_reviewee.reviewee.space_member.user.username
        return ""
    
class SubmissionDetailSerializer(serializers.ModelSerializer):
    reviewed_by = serializers.SerializerMethodField()
    subtask_comments = serializers.SerializerMethodField()
    class Meta:
        model = AssignmentSubmission
        fields = [
            'id',
            'assignment_reviewee',
            'assignment_team',
            'submitted_at',
            "reviewed_by",
            "status",
            "reviewee_comment",
            "reviewer_comment",
            'subtask_comments',
        ]
        
    def get_reviewed_by(self,obj):
        if obj.assignment_reviewer:
            return obj.assignment_reviewer.reviewer.space_member.user.username
        return None
    
    def get_subtask_comments(self,obj):
        assignment_submission_id = self.context.get('submission_id')
        subtask_comments = SubtaskSubmission.objects.filter(assignment_submission = assignment_submission_id)
        return SubtaskSubmitSerializer(subtask_comments,many =True).data