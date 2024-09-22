from django.db import models
from django.contrib.auth import models

# Create your models here.

class UserProfile(models.AbstractUser):
    user_bio = models.CharField( max_length=150)
    phone_number = models.In