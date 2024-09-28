from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_bio = models.CharField( max_length=250,blank=True,null=True)
    phone_number = models.CharField( max_length=15,blank=True,null=True)
    profile_image = models.ImageField(upload_to='user_profile/',null=True, blank=True)
    background_image = models.ImageField(upload_to='user_background/',null=True, blank=True)
    department = models.CharField( max_length=50,blank=True,null=True)
    enrollment_no = models.CharField( max_length=10,blank=True,null=True)
    
    def __str__(self):
        return self.user.username