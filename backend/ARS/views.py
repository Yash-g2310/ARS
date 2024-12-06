from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCsrfToken(GenericAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        return Response({'csrfToken': get_token(request)})
    
    def options(self, request, *args, **kwargs):
        return Response(status=200)

@method_decorator(csrf_exempt, name='dispatch')
class SessionCheckView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        return Response({'session': request.user.is_authenticated})
    
    def options(self, request, *args, **kwargs):
        return Response(status=200)