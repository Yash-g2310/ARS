from django.contrib import admin
from .models import Space,SpaceMember,SpaceInvitation
# Register your models here.

admin.site.register(Space)
admin.site.register(SpaceMember)
admin.site.register(SpaceInvitation)
