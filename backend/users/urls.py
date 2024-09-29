from django.urls import path,include
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('register/',views.UserRegistrationView.as_view(),name='user_register'),
    path('login/',views.LoginView.as_view(),name="log_in"),
    path('logout/',views.LogoutView.as_view(),name="log_out"),
    path('<str:username>/profile/',views.UserProfileDetailView.as_view(),name='profile_details'),
    path('channeli_login/',views.ChanneliTokenView.as_view(),name='channeli_login'),
    path('oauth/callback/',views.ChanneliTokenRecall.as_view(),name='channeli_callback'),
    # path('<str:username>/',views.UserProfileListView.as_view(),name='user'),
]
