from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('status/',views.AssignmentStatusView.as_view(),name = 'assignment_status'),
    path('submissions/',views.AssignmentSubmissionListView.as_view(),name = 'list_all_submissions'),
    path('solo/<int:assignment_reviewee_id>/submit-assignment/',views.AssignmentSubmitSoloView.as_view(),name = 'submit_assignment_solo'),
    path('team/<int:assignment_team_id>/submit-assignment/',views.AssignmentSubmitTeamView.as_view(),name = 'submit_assignment_team'),
    path('solo/<int:assignment_reviewee_id>/',views.AssignmentSubmissionListView.as_view(),name = 'reviewee_submission_list'),
    path('team/<int:assignment_team_id>/',views.AssignmentSubmissionListView.as_view(),name = 'team_submission_list'),
    path('<int:submission_id>/details/',views.SubmissionDetailView.as_view(),name = 'submission_detail'),
    path('<int:submission_id>/start-review/',views.StartReviewView.as_view(),name = 'start_review'),
    path('<int:submission_id>/end-review/',views.EndReviewSubmissionView.as_view(),name = 'end-review'),
]
