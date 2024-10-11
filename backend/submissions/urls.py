from django.urls import path,include
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('status/',views.AssignmentStatusView.as_view(),name = 'assignment_status'),
]
