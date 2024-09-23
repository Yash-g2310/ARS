from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_bio = models.CharField( max_length=150)
    phone_number = models.CharField( max_length=15,blank=True)
    profile_image = models.ImageField(upload_to='user_profile/',null=True, blank=True)
    background_image = models.ImageField(upload_to='user_background/',null=True, blank=True)
    department = models.CharField( max_length=50)
    enrollment_no = models.CharField( max_length=10)
    
    def __str__(self):
        return self.user.username