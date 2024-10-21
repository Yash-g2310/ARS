from rest_framework import serializers
from submissions.models import AssignmentSubmission

class StartReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = []
        

class EndReviewSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['status','reviewer_comment']
        
    def validate_status(self,val):
        if val == AssignmentSubmission.IN_PROGRESS or val == AssignmentSubmission.NOT_STARTED:
            raise serializers.ValidationError("Assignment Status Invalid")
        return val
    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)  # Retain the existing status if not provided
        instance.reviewer_comment = validated_data.get('reviewer_comment', instance.reviewer_comment)  # Update if provided
        instance.save()
        return instance