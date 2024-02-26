from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . import models
from .models import ClaimModel

# Returns clean data

UserModel = get_user_model()
BagModel = models.BagModel
QuestionModel = models.QuestionModel
VendorModel = models.VendorModel
AdminModel = models.AdminModel

#LeaderboardModel = models.LeaderboardModel

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'], username=clean_data['username'], role=clean_data['role'])
		user_obj.username = clean_data['username']
		user_obj.save()
		return user_obj

class UserLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()
	def get_user(self, username, password):
		user = authenticate(username=username, password=password)
		if not user:
			raise ValidationError('user not found')
		return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('id', 'username', 'email', 'role', 'password', 'first_name', 'last_name', 'score')
		extra_kwargs = {'password': {'write_only': True}} ## not iclude password in response, but can still be used in request
		# Removed is_vendor but not sure


class VendorSerializer(serializers.ModelSerializer):
	class Meta:
		model = VendorModel
		fields = ('email','username', 'role', 'location')

class AdminSerializer(serializers.ModelSerializer):
	class Meta:
		model = AdminModel
		fields = ('email', 'username')

class BagsSerializer(serializers.ModelSerializer):
	class Meta:
		model = BagModel
		fields = ('bag_id', 'collection_time', 'vendor_id')


class QuestionsSerializer(serializers.ModelSerializer):
	class Meta:
		model = QuestionModel
		fields = ('question_id', 'question', 'answer')


class ClaimsSerializer(serializers.ModelSerializer):
	class Meta:
		model = ClaimModel
		fields = ('claim_id', 'bag', 'user', 'time', 'success')

class LeaderboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('user_id', 'fname', 'lname', 'score')

