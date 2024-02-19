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
	score = models.IntegerField(default=0)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	objects = AppUserManager()
	def __str__(self):
		return self.username

class WebsiteUserModel():
	user_id = models.OneToOneField(AppUser, on_delete=models.CASCADE)
	fname = models.CharField(max_length=25)
	lname = models.CharField(max_length=25)
	score = models.IntegerField(default=0)

	def __str__(self):
		return f'id:{self.user_id}, fname: {self.fname}, lname: {self.lname}, email: {self.email}, score: {self.score}'

class VendorModel(models.Model):
		vendor_id = models.AutoField(primary_key=True)
		name = models.CharField(max_length=25)
		location = models.CharField(max_length=25)

		def __str__(self):
				return f'vendor_id: {self.vendor_id}, name: {self.name}, num_bags: {self.num_bags}, location: {self.location}'

class BagModel(models.Model):
		bag_id = models.AutoField(primary_key=True)
		time = models.DateTimeField()
		vendor_id = models.ForeignKey(VendorModel, on_delete=models.CASCADE)

		def __str__(self):
			return f'id: {self.bag_id}, time: {self.time}, vendor_id: {self.vendor_id}'

class ClaimModel(models.Model):
	claim_id = models.AutoField(primary_key=True)
	bag_id = models.ForeignKey(BagModel, on_delete=models.CASCADE)
	user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE)
	time = models.DateTimeField()
	success = models.BooleanField(default=False)

	def __str__(self):
		return f'id: {self.claim_id}, bag_id: {self.bag_id}, user_id: {self.user_id}, time: {self.time}, success: {self.success}'

class QuestionModel(models.Model):
	question_id = models.AutoField(primary_key=True)
	question = models.CharField(max_length=25)

	def __str__(self):
		return f'question_id: {self.question_id}, question: {self.question}, answer: {self.answer}'

class AnswerModel(models.Model):
		answer_id = models.AutoField(primary_key=True)
		answer = models.CharField(max_length=128)
		is_correct = models.BooleanField(default=False)
		question_id = models.ForeignKey(QuestionModel, on_delete=models.CASCADE)

		def __str__(self):
			f'answer_id: {self.answer_id}, answer: {self.answer}, is_correct: {self.is_correct}, question_id: {self.question_id}'
