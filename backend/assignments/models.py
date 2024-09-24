from django.db import models
from spaces.models import SubSpaceMember,SubSpace
from django.utils import timezone
# Create your models here.

class Assignment(models.Model):
    uploader = models.ForeignKey(SubSpaceMember, on_delete=models.SET_NULL,null=True)
    sub_space =  models.ForeignKey(SubSpace, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250)
    upload_date = models.DateField(default=timezone.now)
    # subtaskCount = models.IntegerField(default=0)
    
    @property
    def subtask_count(self):
        return self.assignmentsubtask_set.count()
    

class AssignmentDetails(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=500,null = True,blank=True)

class AssignmentSubtask(models.Model):
    COMPULSORY = 'compulsory'
    OPTIONAL = 'OPTIONAL'
    BROWNIE = 'brownie_point'
    SUBTASK_TAGS = [
        (COMPULSORY,'Compulsory'),
        (OPTIONAL,'Optional'),
        (BROWNIE,'Brownie_Points'),
    ]
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=350,null = True,blank=True)
    tag = models.CharField(max_length=20,choices=SUBTASK_TAGS,default=OPTIONAL)

class AssignmentReviewer(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    reviewer = models.ForeignKey(SubSpaceMember,on_delete=models.CASCADE)

class AssignmentReviewee(models.Model):
    SUBMITTED = 'submitted'
    NOT_SUBMITTED = 'not_submitted'
    COMPLETED = 'completed'
    REVIEWEE_STATUS_LIST = [
        (SUBMITTED,'Submitted'),
        (NOT_SUBMITTED,'Not_Submitted'),
        (COMPLETED,'Completed'),
    ]
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    reviewee = models.ForeignKey(SubSpaceMember,on_delete=models.CASCADE)
    # submission_count = models.IntegerField(default=0)
    reviewee_status = models.CharField(max_length=20, choices=REVIEWEE_STATUS_LIST,default=NOT_SUBMITTED)
    
    @property
    def submission_count(self):
        return self.assignmentsubmission_set.count()

class AssignmentTeam(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    team_name = models.CharField(max_length=50)
    # member_count = models.IntegerField(default=0)
    submission_count = models.IntegerField(default=0)
    
    @property
    def member_count(self):
        return self.teammember_set.count()

class TeamMember(models.Model):
    team = models.ForeignKey(AssignmentTeam,on_delete=models.CASCADE)
    member = models.ForeignKey(SubSpaceMember,on_delete=models.CASCADE)