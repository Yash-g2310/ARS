from rest_framework import serializers
from .models import AssignmentReviewee,AssignmentSubmission,AssignmentTeam
from assignments.models import Assignment


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