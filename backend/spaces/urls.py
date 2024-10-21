from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('',views.SpaceListView.as_view(),name='space_dashboard'),
    path('create-space/',views.SpaceCreateView.as_view(), name= 'space_creation'),
    path('<int:pk>/details/',views.SpaceDetailView.as_view(), name= 'space_details'),
    path('<int:pk>/invite-others/',views.SendSpaceInvitationView.as_view(),name='invite_others'),
    path('<int:pk>/requests/',views.AcceptRequestListView.as_view(),name='request_list'),
    path('<int:pk>/requests/<int:req_id>/accept/',views.AcceptRequestView.as_view(),name='accept_request'),
    path('<int:pk>/requests/<int:req_id>/reject/',views.RejectRequestView.as_view(),name='reject_request'),
    path('<int:pk>/members/',views.SpaceMembersListView.as_view(),name='space_members_list'),
    path('<int:pk>/create-subspace/',views.SubSpaceCreateView.as_view(),name='create_subspace'),
    path('<int:pk>/',views.SubSpaceListView.as_view(),name='subspace_list'),
    path('<int:pk>/<int:id>/details/',views.SubSpaceDetailView.as_view(),name='subspace_list'),
    path('<int:pk>/<int:id>/members/',views.SubSpaceMembersListView.as_view(),name='space_members_list'),
    path('<int:pk>/<int:id>/', include(('assignments.urls', 'assignments'), namespace='assignments')),
]
