from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, User

class AppUserManager(BaseUserManager):
	def create_user(self, email, password=None):
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
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email, password)
		user.is_superuser = True
		user.save()
		return user


class AppUser(AbstractBaseUser, PermissionsMixin):
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50)
	## nullable field
	vendor_id = models.IntegerField(null=True)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	objects = AppUserManager()
	def __str__(self):
		return self.username

class WebsiteUserModel(models.Model):
	user_id = models.OneToOneField(AppUser, on_delete=models.CASCADE)
	fname = models.CharField(max_length=25)
	lname = models.CharField(max_length=25)
	score = models.IntegerField(default=0)

	def __str__(self):
		return f'id:{self.user_id}, fname: {self.fname}, lname: {self.lname}, email: {self.email}, score: {self.score}'

class VendorModel(models.Model):
		vendor_id = models.AutoField(primary_key=True)
		description = models.CharField(max_length=255, null=True)
		name = models.CharField(max_length=25)
		location = models.CharField(max_length=25)

		def __str__(self):
				return f'vendor_id: {self.vendor_id}, description: {self.description}, name: {self.name}, location: {self.location}'

class BagModel(models.Model):
		bag_id = models.AutoField(primary_key=True)
		collection_time = models.DateTimeField()  # collection time
		vendor_id = models.ForeignKey(VendorModel, on_delete=models.CASCADE)

		def __str__(self):
			return f'id: {self.bag_id}, collection_time: {self.collection_time}, vendor_id: {self.vendor_id}'

class ClaimModel(models.Model):
	claim_id = models.AutoField(primary_key=True)
	bag_id = models.ForeignKey(BagModel, on_delete=models.CASCADE)
	user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE)
	time = models.DateTimeField()
	success = models.BooleanField(default=False)

	def __str__(self):
		return f'id: {self.claim_id}, bag_id: {self.bag_id}, user_id: {self}, time: {self.time}, success: {self}'

class QuestionModel(models.Model):
	question_id = models.AutoField(primary_key=True)
	question = models.CharField(max_length=25)
	answer = models.CharField(max_length=25)

	def __str__(self):
		return f'question_id: {self.question_id}, question: {self.question}, answer: {self.answer}'
