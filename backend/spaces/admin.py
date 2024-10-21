from django.contrib import admin
from .models import Space,SpaceMember,SpaceInvitation,SpaceJoinRequest,SubSpaceMember,SubSpace
# Register your models here.

admin.site.register(Space)
admin.site.register(SpaceMember)
admin.site.register(SpaceInvitation)
admin.site.register(SpaceJoinRequest)
admin.site.register(SubSpace)
admin.site.register(SubSpaceMember)
