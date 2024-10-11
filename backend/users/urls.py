from django.urls import path,include
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('auth/channeli/',views.ChanneliTokenView.as_view(),name='channeli_login'),
    path('auth/channeli/callback/',views.ChanneliTokenRecall.as_view(),name='channeli_callback'),
    path('register/',views.UserRegistrationView.as_view(),name='user_register'),
    path('login/',views.LoginView.as_view(),name="log_in"),
    path('logout/',views.LogoutView.as_view(),name="log_out"),
    path('<str:user__username>/profile/',views.UserProfileDetailView.as_view(),name='profile_details'),
    path('<str:username>/profile/change-password/',views.ChangePasswordView.as_view(),name='change_pass'),
    path('<str:username>/profile/change-username/',views.ChangeUsernameView.as_view(),name='change_username'),
    path('<str:username>/delete/',views.UserDeleteView.as_view(),name='user_delete'),
]
