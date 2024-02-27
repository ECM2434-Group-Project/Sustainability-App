from django.contrib.auth.backends import BaseBackend
from .models import VendorModel, AdminModel

## Finn Van Monfort
class VendorModelBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = VendorModel.objects.get(username=username)
            if user.check_password(password):
                return user
        except VendorModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return VendorModel.objects.get(pk=user_id)
        except VendorModel.DoesNotExist:
            return None

## Oscar Green
class AdminModelBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = AdminModel.objects.get(username=username)
            if user.check_password(password):
                return user
        except AdminModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return AdminModel.objects.get(pk=user_id)
        except AdminModel.DoesNotExist:
            return None