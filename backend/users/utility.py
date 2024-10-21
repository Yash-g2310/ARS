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
    except Exception as e: 
        return {"error":"problem in fetching values form json","error message":e}
    
    try:
        user_profile = UserProfile.objects.filter(enrollment_no=enroll).first()
    except Exception as e:
        return {"error": "problem in getting user profile", "error message": str(e)}
    
    if user_profile is None:
        try:
            user= User.objects.create(
                username = username,
                email= email,
                first_name= first_name,
                last_name= last_name,
            )
            user.set_unusable_password()
            print(user.has_usable_password())
            user.save()
        except Exception as e:
            return {"error": "problem in creating new user instance", "error message": str(e)}

        try:
            user_profile_new = UserProfile.objects.create(
                user=user,
                profile_image=dp,
                department=department,
                enrollment_no=enroll
            )
            user_profile_new.save()
        except Exception as e:
            return {"error": "problem in creating new instance of user profile", "error message": str(e)}
        return user
    
    user = user_profile.user
    if user is None:
        return {"error":"user profile exist but user not"}
    return user
    