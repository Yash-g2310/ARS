"""
URL configuration for ARS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from spaces.views import AcceptInvite,JoinSpaceRequestView
from .views import GetCsrfToken,SessionCheckView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/',include([
        path('csrf/',GetCsrfToken.as_view(),name='get_csrf_token'),
        path('session/',SessionCheckView.as_view(),name='check_session'),
        path('accept-invite/<uuid:invite_token>/',AcceptInvite.as_view(),name='accept_invite'),
        path('join-space/<uuid:space_token>/',JoinSpaceRequestView.as_view(),name='join_space'),
        path('auth/',include('users.urls')),
        path('<str:username>/', include(('spaces.urls', 'spaces'), namespace='spaces')),
    ])),
]

urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
