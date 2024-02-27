from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser

from django.db.models import Choices


class UserModel(AbstractUser, PermissionsMixin):
    """
    Creates a User model

    Attributes:
        username
        first_name
        last_name
        email
        password
    """

    class Role(models.TextChoices):
        """Gives the User a role"""
        ADMIN = "ADMIN", 'Administrator'
        USER = "USER", 'User'
        VENDOR = "VENDOR", 'Vendor'

    # Any sign up will be a user
    base_role = Role.USER
    # Makes role a mandatory field so user cannot be undefined
    role = models.CharField(max_length=50, choices=Role.choices)
    score = models.IntegerField(default=0)

    class UserManager(BaseUserManager):
        def get_queryset(self, *args, **kwargs):
            results = super().get_queryset(*args, **kwargs)
            return results.filter(role=UserModel.Role.USER)

    user = UserManager()

    class Meta:
        permissions = [
            # Assign default permissions
        ]

    # Overrides save method to set base_role to the default value
    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)

class LocationModel(models.Model):
    """Model for storing locations of vendors"""
    location_id = models.AutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        """Return string representation of the Locations"""
        return f'location_id: {self.location_id}, location: {self.location}'

class VendorModel(UserModel):
    """
    Creates a Vendor model

    Attributes:
        username ( name of vendor)
        first_name ( name of manager?)
        last_name ( name of manager?)
        email
        password
    """
    base_role = UserModel.Role.VENDOR
    location = models.CharField(max_length=25)
    bags_left = models.IntegerField(default=0)

    class VendorManager(BaseUserManager):
        def get_queryset(self, *args, **kwargs):
            results = super().get_queryset(*args, **kwargs)
            return results.filter(role=UserModel.Role.VENDOR)

    vendor = VendorManager()

    class Meta:

        permissions = [
            # addbag etc.
        ]


class AdminModel(UserModel):
    """
    Creates a Admin model

    Attributes:
        Inherits from User

    Command: python manage.py createsuperuser
    """

    base_role = UserModel.Role.ADMIN
    permission_level = models.IntegerField(default=0)

    class AdminManager(BaseUserManager):
        def get_queryset(self, *args, **kwargs):
            results = super().get_queryset(*args, **kwargs)
            return results.filter(role=UserModel.Role.ADMIN)

    admin = AdminManager()

    class Meta:
        # Flags that Admin is a proxy model of User
        permissions = [
        ]


"""class VendorModel(models.Model):
	#Model for the Vendors
	vendor_id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=25)
	location = models.CharField(max_length=25)

	def __str__(self):
			#Return string representation of VendorModel
            return f'vendor_id: {self.vendor_id}, name: {self.name}, num_bags: {self.num_bags}, location: {self.location}'
"""


class BagModel(models.Model):
    """Model for the Bags"""
    bag_id = models.AutoField(primary_key=True)
    collection_time = models.DateTimeField()
    vendor = models.ForeignKey(VendorModel, on_delete=models.CASCADE)

    def __str__(self):
        """Return string representation of the Bags"""
        return f'id: {self.bag_id}, time: {self.time}, vendor_id: {self.vendor}'


class ClaimModel(models.Model):
    """Model for the Claims"""
    claim_id = models.AutoField(primary_key=True)
    bag = models.ForeignKey(BagModel, on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    time = models.DateTimeField()

    def __str__(self):
        """Return string representation of the bags"""
        return f'id: {self.claim_id}, bag_id: {self.bag}, user_id: {self.user}, time: {self.time}, success: {self.success}'


class QuestionModel(models.Model):
    """Model for the Qestions"""
    question_id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=128)

    def __str__(self):
        """Return string representation of the Question"""
        return f'question_id: {self.question_id}, question: {self.question}'


class AnswerModel(models.Model):
    """Model for the answers"""
    answer_id = models.AutoField(primary_key=True)
    answer = models.CharField(max_length=128)
    is_correct = models.BooleanField()
    question = models.ForeignKey(QuestionModel, on_delete=models.CASCADE)

    def __str__(self):
        """Return string representation of the answers"""
        return f'answer_id: {self.answer_id}, answer: {self.answer}, is_correct: {self.is_correct}, question_id: {self.question_id}'

