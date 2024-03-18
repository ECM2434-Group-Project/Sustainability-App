from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser

from django.db.models import Choices
from django.utils.crypto import get_random_string


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
    # todo: if issues arise re add custom save function
    # Overrides save method to set base_role to the default value


class LocationModel(models.Model):
    """Model for storing locations of vendors"""
    location_id = models.AutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius = models.FloatField(default=500) # meters

    def __str__(self):
        """Return string representation of the Locations"""
        return f'location_id: {self.location_id}, latitude: {self.latitude}, longitude: {self.longitude}, radius: {self.radius}'

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
    location = models.ForeignKey(LocationModel, on_delete=models.CASCADE)
    bags_left = models.IntegerField(default=0)
    icon = models.CharField(max_length=256, default='https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg')
    banner = models.CharField(max_length=256, default='https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png')

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

    def __str__(self):
        """Return string representation of the Admin"""
        return (f'username: {self.username}, email: {self.email}, role: {self.role}'
                f', permission_level: {self.permission_level}')

class AllergenModel(models.Model):
    '''Model for the Allergens'''
    allergen_id = models.AutoField(primary_key=True)
    vegan = models.BooleanField(default=False)
    vegetarian = models.BooleanField(default=False)
    milk = models.BooleanField(default=False)
    eggs = models.BooleanField(default=False)
    fish = models.BooleanField(default=False)
    crustacean = models.BooleanField(default=False)
    tree_nuts = models.BooleanField(default=False)
    peanuts = models.BooleanField(default=False)
    wheat = models.BooleanField(default=False)
    soybeans = models.BooleanField(default=False)
    sesame = models.BooleanField(default=False)


    def __str__(self):
        """Return string representation of the Allergens"""
        return f'allergen_id: {self.allergen_id}, vegan: {self.vegan}, vegetarian: {self.vegetarian} milk: {self.milk}, eggs: {self.eggs}, fish: {self.fish}, crustacean: {self.crustacean}, tree_nuts: {self.tree_nuts}, peanuts: {self.peanuts}, wheat: {self.wheat}, soybeans: {self.soybeans}, sesame: {self.sesame}'
class BagGroupModel(models.Model):
    '''Model for the BagGroups'''
    bag_group_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    vendor = models.ForeignKey(VendorModel, on_delete=models.CASCADE)
    allergen = models.ForeignKey(AllergenModel, on_delete=models.CASCADE)
    bags_unclaimed = models.IntegerField(default=0) # no default, this must be set

class BagModel(models.Model):
    """Model for the Bags"""
    bag_id = models.AutoField(primary_key=True)
    bag_group = models.ForeignKey(BagGroupModel, on_delete=models.CASCADE)
    collection_time = models.DateTimeField()
    claimed = models.BooleanField(default=False)

    def __str__(self):
        """Return string representation of the Bags"""
        return f'id: {self.bag_id}, time: {self.collection_time}, claimed: {self.claimed}, allergen_id: {self.bag_group.allergen.allergen_id}'


class ClaimModel(models.Model):
    """Model for the Claims

    claim_id = unique identifier
    bag = bag relate to claim
    user = user relate to claim
    time = time of claim
    success = if claim was sucessful
    """
    claim_id = models.AutoField(primary_key=True)
    bag = models.ForeignKey(BagModel, on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    time = models.DateTimeField()
    success = models.BooleanField(default=False)

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
        return f'answer_id: {self.answer_id}, answer: {self.answer}, is_correct: {self.is_correct}, question_id: {self.answer_id}'

class QuizRecordModel(models.Model):
    """Model to record active quiz by hash"""
    quiz_record_id = models.AutoField(primary_key=True)
    quiz_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

class EmailVerification(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(length=32)
        super().save(*args, **kwargs)

class ImageModel(models.Model):
    id = models.AutoField(primary_key=True)
    vendor_id = models.OneToOneField(VendorModel, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=128, default='your_default_value')
    image_url = models.CharField(max_length=128, default='your_default_value')