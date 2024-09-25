from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.


class Space(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    space_name = models.CharField(max_length=50)
    space_bio = models.CharField(max_length=250)
    create_date = models.DateTimeField(default=timezone.now)
    space_profile = models.ImageField(upload_to='space_profile/',null=True, blank=True)
    space_background = models.ImageField(upload_to='space_background/',null=True, blank=True)
    
    def __str__(self) :
        return self.space_name
    
    @property
    def member_count(self):
        return self.spacemember_set.count()
    
    @property
    def sub_space_count(self):
        return self.subspace_set.count()
    
class SubSpace(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    sub_space_name = models.CharField(max_length=50)
    sub_space_bio = models.CharField(max_length= 250)
    create_date = models.DateField(default= timezone.now)
    
    def __str__(self) :
        return self.sub_space_name
    
    @property
    def reviewer_count(self):
        return self.subspacemember_set.filter(role='reviewer').count()
    
    @property
    def reviewee_count(self):
        return self.subspacemember_set.filter(role='reviewee').count()
    
    @property
    def group_count(self):
        return self.group_set.filter(sub_space=self).count()


class SpaceMember(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)
    
    class Meta:
        unique_together = [('space','user')]

class SubSpaceMember(models.Model):
    REVIEWEE = 'reviewee'
    REVIEWER = 'reviewer'
    ROLE_CHOICES = [
        ('reviewer','Reviewer'),
        ('reviewee','Reviewee'),
    ]
    space_member = models.ForeignKey(SpaceMember,on_delete=models.CASCADE)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES,default=REVIEWEE)
    
    class Meta:
        unique_together = [('space_member','sub_space')]
        
class Group(models.Model):
    space = models.ForeignKey(Space,on_delete=models.CASCADE,null=True)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE,null=True)
    group_name = models.CharField(max_length=50)
    create_date = models.DateField(default=timezone.now)
    
    def __str__(self):
        return self.group_name
    
    @property
    def member_count(self):
        return self.groupmember_set.count()

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    join_date = models.DateField(default=timezone.now)
    
    class Meta:
        unique_together = [('group','user')]