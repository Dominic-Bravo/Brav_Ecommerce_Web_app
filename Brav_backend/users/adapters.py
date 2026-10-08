# users/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import perform_login
from django.contrib.auth import get_user_model

import random
from django.db import transaction
from .models import Profile  # Adjust this import to match your profile app path
from datetime import datetime

User = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def populate_user(self, request, sociallogin, data):
        """
        Populates the User model with details from the Google OAuth payload.
        """
        user = super().populate_user(request, sociallogin, data)
        extra_data = sociallogin.account.extra_data

        # Fallback extraction directly from Google extra data fields
        user.first_name = extra_data.get("given_name") or extra_data.get("first_name") or "User"
        user.last_name = extra_data.get("family_name") or extra_data.get("last_name") or str(random.randint(1000, 9999))

        # Default the role to customer if not set
        if not getattr(user, "role", None):
            user.role = User.Role.CUSTOMER

        return user

    def save_user(self, request, sociallogin, form=None):
        """
        Overrides save_user to automatically create the associated Profile 
        with default or Google-provided information.
        """
        # Save the primary user account securely
        user = super().save_user(request, sociallogin, form)
        extra_data = sociallogin.account.extra_data

        # Handle Profile creation safely within a transaction
        with transaction.atomic():
            # Ensure we don't duplicate profiles if connecting an existing account
            profile, created = Profile.objects.get_or_create(user=user)
            
            if created:
                # Extract avatar URL from Google payload
                profile.avatar = extra_data.get("picture", "")
                
                # Extract gender and apply default if not set or empty
                profile.gender = extra_data.get("gender")
                if not profile.gender:
                    profile.gender = "Not Specified"  # Or your profile choice here
                
                # --- DATE OF BIRTH EXTRACTION ---
                raw_birthday = extra_data.get("birthday")
                parsed_dob = None

                if raw_birthday:
                    # Handle common Google API date string combinations
                    for date_format in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d"):
                        try:
                            parsed_dob = datetime.strptime(raw_birthday, date_format).date()
                            # If Google returns only month/day (due to hidden privacy settings), inject a default year
                            if date_format == "%m/%d":
                                parsed_dob = parsed_dob.replace(year=2000)
                            break
                        except ValueError:
                            continue

                # Fallback to a placeholder date if Google doesn't provide it or if it's private
                if parsed_dob:
                    profile.date_of_birth = parsed_dob
                else:
                    profile.date_of_birth = datetime.strptime("2000-01-01", "%Y-%m-%d").date()
                
                # Save metadata
                profile.save()

        return user

    # def populate_user(self, request, sociallogin, data):
    #     """Ensure new social accounts default to customer role."""
    #     user = super().populate_user(request, sociallogin, data)
    #     if not getattr(user, "role", None):
    #         user.role = "customer"
    #     return user

    def pre_social_login(self, request, sociallogin):
        """
        Auto-link social account to an existing standard email account
        if the email addresses match.
        """
        if sociallogin.is_existing:
            return

        email = sociallogin.account.extra_data.get("email")
        if not email:
            return

        try:
            user = User.objects.get(email=email)
            sociallogin.connect(request, user)
        except User.DoesNotExist:
            pass