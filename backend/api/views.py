from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Recipe
from .serializers import UserProfileSerializer, RecipeSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction

# Create your views here.

class UserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access by default

    @action(detail=False, methods=['post'])
    def create_profile(self, request):
        try:
            # Validate required fields
            required_fields = ['firebase_uid', 'email']
            for field in required_fields:
                if field not in request.data:
                    return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if profile already exists
            if UserProfile.objects.filter(firebase_uid=request.data['firebase_uid']).exists():
                return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user profile
            profile = UserProfile.objects.create(
                firebase_uid=request.data['firebase_uid'],
                email=request.data['email'],
                first_name=request.data.get('first_name', ''),
                last_name=request.data.get('last_name', ''),
                bio=request.data.get('bio', ''),
                location=request.data.get('location', ''),
                profile_picture=request.data.get('profile_picture', None)
            )

            # Serialize the profile data
            serializer = UserProfileSerializer(profile)

            return Response({
                'profile': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Profile creation error: {str(e)}")  # Log the error
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def get_profile(self, request, pk=None):
        try:
            profile = UserProfile.objects.get(firebase_uid=pk)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Profile retrieval error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['put'])
    def update_profile(self, request, pk=None):
        try:
            profile = UserProfile.objects.get(firebase_uid=pk)
            
            # Get the user data from the request
            user_data = {
                'username': request.data.get('user.username'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
                'email': request.data.get('user.email'),
            }
            
            # Update the user if it exists
            if profile.user:
                for field, value in user_data.items():
                    if value is not None:
                        setattr(profile.user, field, value)
                profile.user.save()
            
            # Update the profile
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Profile update error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        profile = self.get_queryset().first()
        if profile:
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
