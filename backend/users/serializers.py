from rest_framework import serializers
from users.models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    # enrollment_no = serializers.CharField(read_only = True)
    # department = serializers.CharField(read_only = True)
    class Meta:
        model = UserProfile 
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'user_bio',
            'phone_number',
            'profile_image',
            'background_image',
            'department',
            'enrollment_no',
        ]
    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance, *args, **kwargs)
        request = self.context.get('request')
        if request and request.method in ['PUT','PATCH']:
            self.fields.pop('enrollment_no',None)
            self.fields.pop('department',None)

    def update(self, instance, validated_data):
        user_data = validated_data.get('user',None)
        if user_data:
            instance.user.first_name = user_data.get('first_name',instance.user.first_name)
            instance.user.last_name = user_data.get('last_name',instance.user.last_name)
        instance.user_bio=validated_data.get('user_bio')
        instance.phone_number=validated_data.get('phone_number')
        instance.profile_image=validated_data.get('profile_image')
        instance.background_image=validated_data.get('background_image')
        validated_data.pop('enrollment_no',None)
        validated_data.pop('department',None)
        instance.user.save()
        instance.save()
        return instance


class RestrictedUserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = UserProfile 
        fields = [
            'first_name',
            'last_name',
            'username',
            'user_bio',
            'profile_image',
            'background_image',
            'department',
            'enrollment_no',
        ]

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only = True)
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'password',
            'password2',
        ]
    def validate_username(self,value):
        if User.objects.filter(username = value).exists():
            raise serializers.ValidationError("The username is already taken. Please choose different username.")
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email = value).exists():
            raise serializers.ValidationError("the email is already registered. Please choose different email.")
        return value
    
    def validate(self,validated_data):
        if validated_data['password'] !=validated_data['password2']:
            raise serializers.ValidationError("The passwords doesn't match. Please retry.")
        return validated_data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User(
            username = validated_data['username'],
            email = validated_data['email'],
            first_name=validated_data.get('first_name', validated_data['username']),
            last_name=validated_data.get('last_name', validated_data['username']),
        )
        user.set_password(validated_data['password'])
        user.save()
        user_profile=UserProfile(user=user)
        user_profile.save()
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required = True, write_only = True)
    new_password = serializers.CharField(required = True, write_only = True)
    confirm_password = serializers.CharField(required = True, write_only = True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("new password doesn't match")
        if attrs['new_password'] == attrs['old_password']:
            raise serializers.ValidationError("new and old passwords must be different")
        return attrs

    def validate_old_password(self,val):
        user = self.context['request'].user
        if not user.has_usable_password():
            return val
        if not user.check_password(val):
            raise serializers.ValidationError("old password is incorrect")
        return val

class ChangeUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(required = True, write_only = True)

    def validate_new_username(self,val):
        user = self.context['request'].user
        if user.username == val:
            raise serializers.ValidationError("new username can not be same as old one")
        if User.objects.filter(username = val).exists():
            raise serializers.ValidationError("user with same username already exist, please try again")
        return val