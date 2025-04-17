from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Recipe

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture', 'location', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields if they exist in the data
        for field, value in user_data.items():
            setattr(user, field, value)
        
        user.save()

        # Update profile fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
        
        instance.save()
        return instance

class RecipeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id', 'user', 'title', 'description', 'ingredients', 'instructions', 
                 'cooking_time', 'difficulty', 'image', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 