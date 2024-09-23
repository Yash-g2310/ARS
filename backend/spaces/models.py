from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.


class Spaces(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    space_name = models.CharField(max_length=50)
    space_bio = models.CharField(max_length=150)
    create_date = models.DateTimeField(default=timezone.now)
    space_profile = models.ImageField(upload_to='space_profile/',null=True, blank=True)
    space_background = models.ImageField(upload_to='space_background/',null=True, blank=True)
    member_count = models.IntegerField(default=0)
    subspace_count = models.IntegerField(default= 0)
    
    def __str__(self) :
        return self.space_name
    
