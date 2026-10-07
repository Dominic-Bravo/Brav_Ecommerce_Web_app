# users/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import perform_login
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        """Ensure new social accounts default to customer role."""
        user = super().populate_user(request, sociallogin, data)
        if not getattr(user, "role", None):
            user.role = "customer"
        return user

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