from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . import models

# Returns clean data

UserModel = get_user_model()
#WebsiteUserModel = models.WebsiteUserModel
#VendorModel = models.VendorModel
BagModel = models.BagModel
QuestionModel = models.QuestionModel

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
	username = serializers.CharField()
	password = serializers.CharField()
	def get_user(self, username, password):
		user = authenticate(username=username, password=password)
		if not user:
			raise ValidationError('user not found')
		return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')
		# Removed is_vendor but not sure


class VendorsSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('user_id', 'name', 'role', 'location')



class BagsSerializer(serializers.ModelSerializer):
	class Meta:
		model = BagModel
		fields = ('bag_id', 'collection_time', 'vendor_id')


class QuestionsSerializer(serializers.ModelSerializer):
	class Meta:
		model = QuestionModel
		fields = ('question_id', 'question', 'answer')

class LeaderboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('user_id', 'fname', 'lname', 'score')

