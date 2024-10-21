from django.contrib import admin
from . models import Assignment,AssignmentDetails,AssignmentSubtask,AssignmentReviewer,AssignmentReviewee,AssignmentTeam,TeamMember
# Register your models here.
admin.site.register(Assignment)
admin.site.register(AssignmentDetails)
admin.site.register(AssignmentSubtask)
admin.site.register(AssignmentReviewee)
admin.site.register(AssignmentReviewer)
admin.site.register(AssignmentTeam)
admin.site.register(TeamMember)
