from django.contrib import admin
from .models import Space,SpaceMember,SpaceInvitation,SpaceJoinRequest
# Register your models here.

admin.site.register(Space)
admin.site.register(SpaceMember)
admin.site.register(SpaceInvitation)
admin.site.register(SpaceJoinRequest)
