from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, User, AbstractUser

from django.db.models import Choices

"""class AppUserManager(BaseUserManager):
	#docstring:Custom manager for AppUser model
	def create_user(self, email, password=None):
		#docstring:Create and return a regular user
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		email = self.normalize_email(email)
		user = self.model(email=email)
		user.set_password(password)
		user.save()
		return user
	def create_superuser(self, email, password=None):
		#docstring: Create and return a superuser
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email, password)
		user.is_superuser = True
		user.save()
		return user


class AppUser(AbstractBaseUser, PermissionsMixin):
	#docstringCustom user model
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50)
	## nullable field
	vendor_id = models.IntegerField(null=True) ## if vendor id is null, then user is not a vendor
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	objects = AppUserManager()
	def __str__(self):
		#docstring: Return string representation of username
		return self.username

class WebsiteUserModel(models.Model):


	user_id = models.OneToOneField(AppUser, on_delete=models.CASCADE)
	fname = models.CharField(max_length=25)
	lname = models.CharField(max_length=25)
	score = models.IntegerField(default=0)

	def __str__(self):
		# docstring: Return string representation of WebsiteUserModel
		return f'id:{self.user_id}, fname: {self.fname}, lname: {self.lname}, email: {self.email}, score: {self.score}'"""

class User(AbstractUser):
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
	role = models.CharField( max_length=50,choices=Role.choices)
	score = models.IntegerField(default=0)

	class UserManager(BaseUserManager):
		def get_queryset(self, *args, **kwargs):
			results = super().get_queryset(*args, **kwargs)
			return results.filter(role=User.Role.USER)

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


class Vendor(User):
	"""
	Creates a Vendor model

	Attributes:
		username ( name of vendor)
		first_name ( name of manager?)
		last_name ( name of manager?)
		email
		password
	"""
	base_role = User.Role.VENDOR
	location = models.CharField(max_length=25)

	class VendorManager(BaseUserManager):
		def get_queryset(self, *args, **kwargs):
			results = super().get_queryset(*args, **kwargs)
			return results.filter(role=User.Role.VENDOR)

	vendor = VendorManager()
	class Meta:
		# Flags that Vendor is a proxy model of User
		#Gives vendor certain permissions
		permissions = [
			#addbag etc.
		]

class Admin(User):
	"""
	Creates a Admin model

	Attributes:
		Inherits from User

	Command: python manage.py createsuperuser
	"""

	class Meta:
		# Flags that Admin is a proxy model of User
		proxy = True








"""class VendorModel(models.Model):
	#Model for the Vendors
	vendor_id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=25)
	location = models.CharField(max_length=25)

	def __str__(self):
			#Return string representation of VendorModel
			return f'vendor_id: {self.vendor_id}, name: {self.name}, num_bags: {self.num_bags}, location: {self.location}'"""

class BagModel(models.Model):
	"""Model for the Bags"""
	bag_id = models.AutoField(primary_key=True)
	time = models.DateTimeField()
	vendor = models.ForeignKey(User.Role.VENDOR, on_delete=models.CASCADE)

	def __str__(self):
		"""Return string representation of the Bags"""
		return f'id: {self.bag_id}, time: {self.time}, vendor_id: {self.vendor}'


class ClaimModel(models.Model):
	"""Model for the Claims"""
	claim_id = models.AutoField(primary_key=True)
	bag = models.ForeignKey(BagModel, on_delete=models.CASCADE)
	user = models.ForeignKey(User.Role.USER, on_delete=models.CASCADE)
	time = models.DateTimeField()
	success = models.BooleanField(default=False)

	def __str__(self):
		"""Return string representation of the bags"""
		return f'id: {self.claim_id}, bag_id: {self.bag}, user_id: {self.user}, time: {self.time}, success: {self.success}'


class QuestionModel(models.Model):
	"""Model for the Qestions"""
	question_id = models.AutoField(primary_key=True)
	question = models.CharField(max_length=25)

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

