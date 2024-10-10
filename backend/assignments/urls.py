from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('create-assignment/',views.AssignmentCreateView.as_view(),name = 'create_assignment')
]
