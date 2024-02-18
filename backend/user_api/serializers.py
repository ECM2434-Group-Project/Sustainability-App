from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . import models

# Returns clean data

UserModel = get_user_model()
WebsiteUserModel = models.WebsiteUserModel
VendorModel = models.VendorModel
BagModel = models.BagModel
QuestionModel = models.QuestionModel

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
		user_obj.username = clean_data['username']
		user_obj.save()
		return user_obj

class UserLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()
	def check_user(self, clean_data):
		user = authenticate(username=clean_data['email'], password=clean_data['password'])
		if not user:
			raise ValidationError('user not found')
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username', 'is_vendor')


class VendorsSerializer(serializers.ModelSerializer):
	class Meta:
		model = VendorModel
		fields = ('vendor_id', 'name', 'num_bags', 'location')


class BagsSerializer(serializers.ModelSerializer):
	class Meta:
		model = BagModel
		fields = ('bag_id', 'vendor_id', 'time')


class QuestionsSerializer(serializers.ModelSerializer):
	class Meta:
		model = QuestionModel
		fields = ('question_id', 'question', 'answer')


class LeaderboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = WebsiteUserModel
		fields = ('user_id', 'fname', 'lname', 'score')


class WebsiteUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = WebsiteUserModel
		fields = ('user_id', 'fname', 'lname', 'score')