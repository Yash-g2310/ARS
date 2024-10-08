from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from urllib.parse import urljoin
from django.urls import reverse
import uuid
# Create your models here.


class Space(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    space_name = models.CharField(max_length=100,blank=False,null=False)
    space_bio = models.TextField(blank=True,null=True)
    create_date = models.DateTimeField(auto_now_add=True)
    space_profile = models.ImageField(upload_to='space_profile/',null=True, blank=True)
    space_background = models.ImageField(upload_to='space_background/',null=True, blank=True)
    space_token = models.UUIDField(default=uuid.uuid4,editable=False)
    
    def __str__(self) :
        return self.space_name
    
    @property
    def get_join_url(self):
        join_url = reverse('join_space',kwargs={'space_token':self.space_token})
        return urljoin(settings.FRONTEND_BASE_URL + '/',join_url)
    
    @property
    def member_count(self):
        return self.spacemember_set.count()
    
    @property
    def sub_space_count(self):
        return self.subspace_set.count()
    
class SpaceInvitation(models.Model):
    space = models.ForeignKey(Space,on_delete=models.CASCADE)
    email = models.EmailField()
    invite_token = models.UUIDField(default=uuid.uuid4,unique=True,editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True,blank=True)
    message_by_owner = models.TextField(blank=True,null=True)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    

class SpaceMember(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    join_date = models.DateField(auto_now_add=True)
    
    class Meta:
        unique_together = [('space','user')]
    
    def __str__(self) -> str:
        return f"{self.user.username} -> {self.space.space_name} {self.id}"
        
class SpaceJoinRequest(models.Model):
    ACCEPTED = 'accepted'
    PENDING = 'pending'
    REJECTED = 'rejected'
    REQUEST_STATUS = [
        (ACCEPTED,'Accepted'),
        (REJECTED,'Rejected'),
        (PENDING,'Pending'),
    ]
    
    space = models.ForeignKey(Space,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50,choices=REQUEST_STATUS,default=PENDING)
    
    class Meta:
        unique_together = [('space','user')]

    def __str__(self) -> str:
        return f'{self.user.username} -> {self.space.space_name}'

class SubSpace(models.Model):
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    sub_space_name = models.CharField(max_length=100)
    sub_space_bio = models.TextField(blank=True,null=True)
    create_date = models.DateField(auto_now_add=True)
    
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

class SubSpaceMember(models.Model):
    REVIEWEE = 'reviewee'
    REVIEWER = 'reviewer'
    ROLE_CHOICES = [
        (REVIEWER,'Reviewer'),
        (REVIEWEE,'Reviewee'),
    ]
    space_member = models.ForeignKey(SpaceMember,on_delete=models.CASCADE)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE)
    join_date = models.DateField(auto_now_add=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES,default=REVIEWEE)
    
    class Meta:
        unique_together = [('space_member','sub_space')]
        
class Group(models.Model):
    space = models.ForeignKey(Space,on_delete=models.CASCADE,null=True)
    sub_space = models.ForeignKey(SubSpace,on_delete=models.CASCADE,null=True)
    group_name = models.CharField(max_length=100)
    create_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.group_name
    
    @property
    def member_count(self):
        return self.groupmember_set.count()

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    join_date = models.DateField(auto_now_add=True)
    
    class Meta:
        unique_together = [('group','user')]