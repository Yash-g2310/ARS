from rest_framework import serializers
from users.models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField( required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField( required=True,read_only = True)
    email = serializers.EmailField(required=True,read_only = True)
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

