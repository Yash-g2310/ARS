from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('',views.AssignmentListView.as_view(),name = 'assignment_list'),
    path('create-assignment/',views.AssignmentCreateView.as_view(),name = 'create_assignment'),
    path('<int:assignment_id>/details/',views.AssignmentRetrieveUpdateView.as_view(),name='get_update_assignment'),
    path('<int:assignment_id>/members/',views.AssignmentMembersView.as_view(),name='get_assignment_members'),
    path('<int:assignment_id>/', include(('submissions.urls', 'submissions'), namespace='submissions')),
]
