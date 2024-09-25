from django.db import models
from assignments.models import AssignmentReviewee,AssignmentTeam,AssignmentReviewer,AssignmentSubtask
from django.utils import timezone
# Create your models here.

class AssignmentSubmission(models.Model):
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    NOT_STARTED = "not_started"
    REVIEWED = "reviewed"
    ASSIGNMENT_SUBMISSION_STATUS = [
        (COMPLETED,'Completed'),
        (IN_PROGRESS,'In Progress'),
        (NOT_STARTED,'Not Started'),
        (REVIEWED,'Reviewed')
    ]
    assignment_reviewee = models.ForeignKey(AssignmentReviewee,on_delete=models.SET_NULL, null=True)
    assignment_team = models.ForeignKey(AssignmentTeam,on_delete=models.SET_NULL,null=True)
    submitted_at = models.DateField(default=timezone.now)
    assignment_reviewer = models.ForeignKey(AssignmentReviewer,on_delete=models.SET_NULL,null=True)
    reviewed_at = models.DateField(blank=True,null=True)
    status = models.CharField(max_length=25,choices=ASSIGNMENT_SUBMISSION_STATUS,default=NOT_STARTED)
    reviewee_comment = models.CharField(max_length=250,null=True,blank=True)
    reviewer_comment = models.CharField(max_length=250,null=True,blank=True)
    
class SubtaskStatus(models.Model):
    COMPLETED = "completed"
    PENDING = "pending"
    ASSIGNMENT_SUBTASK_STATUS = [
        (COMPLETED,"Completed"),
        (PENDING,'Pending'),
    ]
    assignment_reviewee = models.ForeignKey(AssignmentReviewee,on_delete=models.CASCADE)
    assignment_subtask = models.ForeignKey(AssignmentSubtask,on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=ASSIGNMENT_SUBTASK_STATUS)

class SubtaskSubmission(models.Model):
    assignment_submission = models.ForeignKey(AssignmentSubmission,on_delete=models.CASCADE)
    assignment_subtask = models.ForeignKey(AssignmentSubtask, on_delete=models.CASCADE)
    reviewee_comment = models.CharField(max_length=250,null=True,blank=True)

