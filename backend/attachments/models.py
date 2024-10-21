from django.db import models
from assignments.models import Assignment
from submissions.models import AssignmentSubmission
import os
# Create your models here.

def attachment_upload_path(instance,filename):
    space_id = instance.assignment.sub_space.space.id
    sub_space_id = instance.assignment.sub_space.id
    assignment_id = instance.assignment.id
    if instance.assignment_submission:
        assignment_submission_type =  'solo' if instance.assignment_submission.assignment_reviewee else 'team'
        assignment_reviewee_id = instance.assignment_submission.assignment_reviewee.id if instance.assignment_submission.assignment_reviewee else None 
        assignment_team_id = instance.assignment_submission.assignment_team.id if instance.assignment_submission.assignment_team else None
        assignment_submission_id = instance.assignment_submission.id 
        return os.path.join(
            'attachments',
            str(space_id),
            str(sub_space_id),
            str(assignment_id),
            str(assignment_submission_type),
            str(assignment_reviewee_id if assignment_team_id is None else assignment_team_id),
            str(assignment_submission_id),
            filename,
        ) 
    else:
        return os.path.join(
                'attachments',
                str(space_id),
                str(sub_space_id),
                str(assignment_id),
                filename,
        )
    

class Attachment(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE,related_name='attachments')
    assignment_submission = models.ForeignKey(AssignmentSubmission,on_delete=models.CASCADE,null=True,related_name='attachments')
    file = models.FileField(upload_to=attachment_upload_path)