from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('create-assignment/',views.AssignmentCreateView.as_view(),name = 'create_assignment'),
    path('',views.AssignmentListView.as_view(),name = 'assignment_list'),
    path('<int:id>/',views.AssignmentRetrieveUpdateView.as_view(),name='get_update_assignment')
]
