from datetime import datetime
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ClaimModel, UserModel, VendorModel, AdminModel
from .serializers import *
from rest_framework import permissions, status
from .validations import *
from .decorators import *
from .backends import VendorModelBackend, AdminModelBackend

# SessionAuthentication -> Check if they're in valid session

class UserRegister(APIView):
	"""
	API endpoint that allows users to be registered. The JSON format is as follows:
	{
		"email": [String],
		"username": [String],
		"password": [String]
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

			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	'''API for user login:
	GET:
	POST:
	Format:
	{
		"email": [String],
		"password": [String]
	}

	'''
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data


		if 'email' in data:
			# if email exists, throws exception if it doesn't
			email = data['email']
			assert validate_email(email)
		else:
			return Response({"message":"Email is missing", "Data-Sent" : data}, status=status.HTTP_400_BAD_REQUEST)

		password = data['password']

		## try user account
		try:
			serializer = UserLoginSerializer(data=data)
			if serializer.is_valid(raise_exception=True):
				username = UserModel.objects.get(email=email).username
				user = serializer.get_user(username, password)
				login(request, user)
				return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)

		# try vendor account
		try:
			vendor_backend = VendorModelBackend()

			username = UserModel.objects.get(email__exact=email).username
			user = vendor_backend.authenticate(request,username=username, password=password, **data)
			if user is not None:
				login(request, user)
				return Response({"message": "Logged in successfully as vendor"}, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)

		## try admin account
		try:
			admin_backend = AdminModelBackend()

			username = UserModel.objects.get(email__exact=email).username
			user = admin_backend.authenticate(request, username=username, password=password, **data)
			if user is not None:
				login(request, user)
				return Response({"message": "Logged in successfully as admin"}, status=status.HTTP_200_OK)
		except:
			pass

		return Response({"message":"Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)





class UserLogout(APIView):
	'''
	This API logs out the user. You do not need to provide any data, simply send a POST request to this endpoint.
	'''
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		print("Logging out")
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		## if the request has a user
		if request.user is None:
			return Response({"message" : "You are not logged in"}, status=status.HTTP_404_NOT_FOUND)

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
		serializer = VendorSerializer(vendors, many=True)
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
		serializer = VendorSerializer(data=data)
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

		serializer = VendorSerializer(vendor)
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
		leaderboard = UserModel.objects.all().order_by('-score')
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
		website_user = UserModel.objects.get(user_id=request.user)
		website_serializer = UserSerializer(website_user)
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




class CreateAdmin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		username = "admin"
		password = "bob12345"
		email = "admin@admin.com"
		user = AdminModel.objects.create_user(username, email, password)
		user.save()
		return Response({"data":user}, status=status.HTTP_201_CREATED)

class CreateVendor(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		username = "vendor"
		password = "bob12345"
		email = "vendor1@v.com"
		location = "location"
		vendor = VendorModel.objects.create_user(username, email, password)
		vendor.location = location
		vendor.save()
		serializer = VendorSerializer(vendor)

		return Response({"data":serializer.data},status=status.HTTP_201_CREATED)
