from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . import models

# Returns clean data

UserModel = get_user_model()
BagModel = models.BagModel
QuestionModel = models.QuestionModel
VendorModel = models.VendorModel
AdminModel = models.AdminModel
AnswerModel = models.AnswerModel
LocationModel = models.LocationModel
ClaimModel = models.ClaimModel
BagGroupModel = models.BagGroupModel


# LeaderboardModel = models.LeaderboardModel

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'],
                                                 username=clean_data['username'], first_name=clean_data['first_name'], last_name=clean_data['last_name'])
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
        extra_kwargs = {
            'password': {'write_only': True}}  ## not iclude password in response, but can still be used in request
    # Removed is_vendor but not sure


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorModel
        fields = ('id','email', 'username','password', 'role', 'location', 'bags_left', 'icon', 'banner', 'first_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class VendorOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorModel
        fields = ('id','username', 'location', 'bags_left')


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminModel
        fields = ('email', 'username')


class BagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BagModel
        fields = ('bag_id', 'collection_time', 'bag_group', 'claimed')

class BagGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BagGroupModel
        fields = ('bag_group_id', 'vendor', 'allergen', 'bags_unclaimed')

class AllergenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AllergenModel
        fields = ('allergen_id', 'vegan', 'vegetarian', 'milk', 'eggs', 'fish', 'crustacean', 'tree_nuts', 'peanuts', 'wheat', 'soybeans', 'sesame')



class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionModel
        fields = ('question_id', 'question')

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerModel
        fields = ('answer', 'answer_id', 'is_correct', 'question')

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerModel
        fields = ('answer', 'answer_id')



class ClaimSerializer(serializers.ModelSerializer):
	class Meta:
		model = ClaimModel
		fields = ('claim_id', 'bag', 'user', 'time')

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('username', 'score')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationModel
        fields = ('latitude', 'longitude', 'radius')

class QuizRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.QuizRecordModel
        fields = ('quiz_record_id', 'quiz_hash', 'created_at')

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImageModel
        fields = ('vendor_id', "name", "image_url")