from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('',views.SpaceListView.as_view(),name='space_dashboard'),
    path('create-space/',views.SpaceCreateView.as_view(), name= 'space_creation'),
    path('<int:pk>/details/',views.SpaceDetailView.as_view(), name= 'space_details'),
    path('<int:pk>/invite-others/',views.SendSpaceInvitationView.as_view(),name='invite_others'),
]
