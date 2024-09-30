from django.contrib.auth.models import User
from .models import UserProfile

def getUserInfo(data):
    try:
        username = data["username"]
        name_parts = data['person'].get("fullName").split()
        first_name = name_parts[0] if len(name_parts)>0 else ""
        last_name = name_parts[1] if len(name_parts)>1 else ""
        email = data['contactInformation']['emailAddress']
        dp = data['person']['displayPicture']
        enroll = data['facultyMember'].get('employeeId') if data['student'].get('enrolmentNumber') is None else data['student'].get('enrolmentNumber')
        department =data['facultyMember'].get('department name') if data['student'].get('branch department name') is None else data['student'].get('branch department name')
        
        user,flag = User.objects.get_or_create(
            username = username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        if(user==None): return None
        if flag:
            user_profile = UserProfile.objects.create(
                user=user,
                profile_image=dp,
                department=department,
                enrollment_no=enroll
            )
        else:
            user_profile = UserProfile.objects.get(user=user)
        if user_profile.enrollment_no==None:
            user_profile.enrollment_no = enroll
        if user_profile.department==None:
            user_profile.department = department
        if user_profile.profile_image==None:
            user_profile.profile_image = dp
        user_profile.save()
        user.save()
        return user
    except:
        return None
    