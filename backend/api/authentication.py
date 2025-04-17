from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
from django.contrib.auth.models import User
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            logger.warning('No authorization header found')
            return None

        try:
            # Extract the token from the header
            id_token = auth_header.split(' ').pop()
            logger.info('Attempting to verify Firebase token')
            
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
            logger.info(f'Token verified successfully for user: {firebase_uid}')
            
            try:
                # Try to get the user profile
                profile = UserProfile.objects.get(firebase_uid=firebase_uid)
                logger.info(f'Found existing profile for user: {firebase_uid}')
                
                if profile.user:
                    logger.info(f'Returning existing Django user: {profile.user.username}')
                    return (profile.user, None)
                
                # Create Django user if it doesn't exist
                logger.info(f'Creating new Django user for Firebase UID: {firebase_uid}')
                user = User.objects.create_user(
                    username=firebase_uid,
                    email=profile.email
                )
                profile.user = user
                profile.save()
                logger.info(f'Created new Django user: {user.username}')
                return (user, None)
                
            except UserProfile.DoesNotExist:
                logger.error(f'No profile found for Firebase UID: {firebase_uid}')
                raise exceptions.AuthenticationFailed('No such user exists')
                
        except Exception as e:
            logger.error(f'Authentication failed: {str(e)}')
            raise exceptions.AuthenticationFailed(str(e))

        return None 