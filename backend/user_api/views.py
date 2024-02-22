from datetime import datetime
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ClaimModel
from .serializers import *
from rest_framework import permissions, status
from .validations import *
from .decorators import *

# SessionAuthentication -> Check if they're in valid session

class UserRegister(APIView):
	"""
	API endpoint that allows users to be registered. The JSON format is as follows:
	{
		"email": [String],
		"username": [String],
		"password": [String],
		"is_vendor": [Boolean] // Optional (Only for admins)
	}
	"""
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		userCreating = request.user



		clean_data = user_creation_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			# Website user needs to be created here
			##if userCreating.Role == 'admin':
			print("Vendor Test:")
			if userCreating.Role == 'ADMIN':
				if clean_data['is_vendor']:
					print("Creating Vendor")
					user.Role = 'VENDOR'
					print(f"Creating vendor: {user.email, user.Role}")



			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	'''API for user login:
	GET:
	POST:
	Format:
	{
		"username": [String],
		"password": [String]
	}
	or
	{
		"email": [String],
		"password": [String]
	}

	The user can login with either their username or email, if both are provided the username will be used.


	'''
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		print(data)
		#assert validate_email(data)
		#assert validate_password(data)



		if 'username' in data:
			# if username exists
			username = data['username']
			email = UserModel.objects.get(username=username).email
			data['email'] = email
		elif 'email' in data:
			email = data['email']
			username = UserModel.objects.get(email=email).username
			data['username'] = username
		else:
			return Response({"message":"Username or Email is missing"}, status=status.HTTP_400_BAD_REQUEST)

		password = data['password']

		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.get_user(username, password)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class VendorsView(APIView):
	'''
	Post:


	Get:
	'''
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		vendors = UserModel.objects.filter(role='VENDOR')
		serializer = VendorsSerializer(vendors, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

	#  @allowed_users(allowed_roles=['vendors'])
	def post(self, request):
		# Deny creation of a vendor to non-vendor users
		if request.user.vendor_id is None:
			return Response(status=status.HTTP_403_FORBIDDEN)
		data = {
			'name': request.data['name'],
			'description' : request.data['description'],
			'location': request.data['location']
		}
		serializer = VendorsSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	

class VendorView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)

	def get_object(self, vendor_id):
		try:
			return VendorModel.objects.get(vendor_id=vendor_id)
		except VendorModel.DoesNotExist:
			raise None

	def get(self, request, vendor_id):
		vendor = self.get_object(vendor_id)
		if not vendor:
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		serializer = VendorsSerializer(vendor)
		return Response(serializer.data, status=status.HTTP_200_OK)


class BagsView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		bags = BagModel.objects.all()
		serializer = BagsSerializer(bags, many=True)
		return Response({'bags': serializer.data}, status=status.HTTP_200_OK)

	def post(self, request):
		if request.user.vendor_id is None:
			return Response(status=status.HTTP_403_FORBIDDEN)
		print(request.data)
		num_bags = request.data['num_bags']
		vendor_id = request.user.vendor_id
		collection_time = request.data['collection_time']
		collection_time = datetime.strptime(collection_time, '%Y-%m-%d %H:%M:%S')
		for i in range(num_bags):

			data = {
				'vendor_id': vendor_id,
				'collection_time' : collection_time
			}
			## clean_data
			serializer = BagsSerializer(data=data)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
			print(i)
		return Response(status=status.HTTP_201_CREATED)

	def getVendor(self, vendor_id):
		try:
			return VendorModel.objects.get(vendor_id=vendor_id)
		except VendorModel.DoesNotExist:
			raise None


class QuestionsView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		questions = QuestionModel.objects.all()
		serializer = QuestionsSerializer(questions, many=True)
		return Response({'questions': serializer.data}, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		leaderboard = WebsiteUserModel.objects.all().order_by('-score')
		# First idea we can make it nicer later
		serializer = LeaderboardSerializer(leaderboard, many=True)
		return Response({'leaderboard': serializer.data}, status=status.HTTP_200_OK)


class WebsiteUserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		# Get standard user info
		serializer = UserSerializer(request.user)
		# Get website user info
		website_user = WebsiteUserModel.objects.get(user_id=request.user)
		website_serializer = WebsiteUserSerializer(website_user)
		return Response({'user': serializer.data, 'website_user': website_serializer.data}, status=status.HTTP_200_OK)


class QuizView(APIView):
	'''JSON format:
	{
	\t 	"claim_id": [Int],
	\t	"q_count": [Int],
	\t	"questions":
	\t\t		[{
	\t\t\t		"question_id": [Int],
	\t\t\t		"answer": [String]
	\t\t		},
	\t\t		{
	\t\t		question_id: [Int],
	\t\t		answer: [String]
	\t\t		}...
	\t	]
	}

	Copy paste:
	{
		"claim_id": 1,
		"q_count": 3,
		"questions":
			[{
				"question_id": 1,
				"answer": "A"
			},
			{
				"question_id": 2,
				"answer": "B"
			},
			{
				"question_id": 3,
				"answer": "C"
			}
		]
	}
'''


	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		claim_id = request.data['claim_id']
		user = request.user
		## check that user owns the claim
		claim = ClaimModel.objects.get(claim_id=claim_id)
		## check if the claim is already successful
		if not claim:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		print(claim)
		if claim.user_id != user:
			print("User does not own the claim")
			return Response(status=status.HTTP_403_FORBIDDEN)


		questions = []
		for i in range(request.data['q_count']):
			print(f"Question: {request.data['questions'][i]['question_id']}, Answer: {request.data['questions'][i]['answer']}")
			## gets the question and user answer
			questions.append([QuestionModel.objects.get(question_id=request.data['questions'][i]['question_id']),
							  request.data['questions'][i]['answer']])

		print(questions)

