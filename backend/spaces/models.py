from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.


class Space(models.Model):
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
    
class SubSpace(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    sub_space_name = models.CharField(max_length=50)
    sub_space_bio = models.CharField(max_length= 150)
    create_date = models.DateField(default= timezone.now)
    reviewer_count = models.IntegerField(default=0)
    reviewee_count = models.IntegerField(default=0) 
    group_count = models.IntegerField(default=0)    
    # subspace_logo
    
    def __str__(self) :
        return self.sub_space_name


class SpaceMember(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)

class SubSpaceMember(models.Model):
    REVIEWEE = 'reviewee'
    REVIEWER = 'reviewer'
    ROLE_CHOICES = [
        ('reviewer','Reviewer'),
        ('reviewee','Reviewee'),
    ]
    spaceMember = models.ForeignKey(SpaceMember,on_delete=models.CASCADE)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES,default=REVIEWEE)
    
class Group(models.Model):
    space = models.ForeignKey(Space,on_delete=models.CASCADE,null=True)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE,null=True)
    group_name = models.CharField(max_length=50)
    create_date = models.DateField(default=timezone.now)
    member_count =models.IntegerField(default=0)
    # group_logo
    
    def __str__(self):
        return self.group_name

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)