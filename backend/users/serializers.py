from rest_framework import serializers
from users.models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source = 'user.first_name',required = True)
    last_name = serializers.CharField(source = 'user.last_name',required = True)
    class Meta:
        model = UserProfile 
        fields = [
            'first_name',
            'last_name',
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
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    