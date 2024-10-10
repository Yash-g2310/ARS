from typing import Iterable
from django.db import models
from spaces.models import SubSpaceMember,SubSpace
from django.utils import timezone
from django.core.exceptions import ValidationError
# Create your models here.

class Assignment(models.Model):
    uploader = models.ForeignKey(SubSpaceMember, on_delete=models.SET_NULL,null=True)
    sub_space =  models.ForeignKey(SubSpace, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(null=False)
    upload_date = models.DateTimeField(auto_now_add=True)
    iteration_date = models.DateTimeField(null=True,blank=True)
    due_date = models.DateTimeField(null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def subtask_count(self):
        return self.assignmentsubtask_set.count()
    
    @property
    def reviewer_count(self):
        return self.assignmentreviewer_set.count()
    @property

    def reviewee_count(self):
        return self.assignmentreviewer_set.count()

    def team_count(self):
        return self.assignmentteam_set.count()
    
    def __str__(self) -> str:
        return f"{self.title}"
    

class AssignmentDetails(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(null = True,blank=True)
    
    def __str__(self) -> str:
        return f"{self.title}"

class AssignmentSubtask(models.Model):
    COMPULSORY = 'compulsory'
    OPTIONAL = 'optional'
    BROWNIE = 'brownie_point'
    SUBTASK_TAGS = [
        (COMPULSORY,'Compulsory'),
        (OPTIONAL,'Optional'),
        (BROWNIE,'Brownie_Points'),
    ]
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(null = True,blank=True)
    tag = models.CharField(max_length=50,choices=SUBTASK_TAGS,default=OPTIONAL)

    def __str__(self) -> str:
        return f"{self.title}"
    
class AssignmentReviewer(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    reviewer = models.ForeignKey(SubSpaceMember,on_delete=models.CASCADE)
    
    class Meta:
        unique_together = [('assignment','reviewer')]
        
    def __str__(self) -> str:
        return f"{self.assignment.title} --> {self.reviewer.space_member.user.username}"

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
    reviewee_status = models.CharField(max_length=40, choices=REVIEWEE_STATUS_LIST,default=NOT_SUBMITTED)
    
    @property
    def submission_count(self):
        return self.assignmentsubmission_set.count()

    class Meta:
        unique_together = [('assignment','reviewee')]
        
    def __str__(self) -> str:
        return f"{self.assignment.title} --> {self.reviewee.space_member.user.username}"
        
class AssignmentTeam(models.Model):
    SUBMITTED = 'submitted'
    NOT_SUBMITTED = 'not_submitted'
    COMPLETED = 'completed'
    TEAM_STATUS_LIST = [
        (SUBMITTED,'Submitted'),
        (NOT_SUBMITTED,'Not_Submitted'),
        (COMPLETED,'Completed'),
    ]
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE)
    team_name = models.CharField(max_length=150)
    team_status = models.CharField(max_length=40, choices=TEAM_STATUS_LIST,default=NOT_SUBMITTED)
    
    @property
    def member_count(self):
        return self.teammember_set.count()
    
    @property
    def submission_count(self):
        return self.assignmentsubmission_set.count()
        
    def __str__(self) -> str:
        return f"{self.assignment.title} --> {self.team_name}"

class TeamMember(models.Model):
    team = models.ForeignKey(AssignmentTeam,on_delete=models.CASCADE)
    member = models.ForeignKey(SubSpaceMember,on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if self.member.role != 'reviewee':
            raise ValidationError(f"{self.member} is not a reviewee!")
        if TeamMember.objects.filter(team__assignment =self.team.assignment, member = self.member).exists():
            raise ValidationError(f"{self.member} is already part of another team")
        
        return super().save(*args, **kwargs)
    
    class Meta:
        unique_together = [('team','member')]
        
    def __str__(self) -> str:
        return f"{self.member.space_member.user.username}"