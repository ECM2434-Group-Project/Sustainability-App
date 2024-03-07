from datetime import datetime
from random import random

from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .models import ClaimModel, UserModel, VendorModel, AdminModel, EmailVerification
from .serializers import *
from rest_framework import permissions, status
from .validations import *
from .decorators import *
from .backends import VendorModelBackend, AdminModelBackend

# Email verification
from django_email_verification import send_email
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
		clean_data = user_creation_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)

			if user:
				send_verification_email(request,user)
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

	def post(self, request):
		data = request.data


		if 'email' in data:
			# if email exists, throws exception if it doesn't
			email = data['email']
			assert validate_email(data)
		else:
			return Response({"message":"Email is missing", "Data-Sent" : data}, status=status.HTTP_400_BAD_REQUEST)

		password = data['password']

		# try user account
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

		# try admin account
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
		# if the request has a user
		if request.user is None:
			return Response({"message" : "You are not logged in"}, status=status.HTTP_404_NOT_FOUND)

		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class VendorsView(APIView):
	'''
	This API endpoint returns a list of all vendors who are currently registered in the system.
	Get:
	'''
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		vendors = VendorModel.objects.all()
		serializer = VendorOverviewSerializer(vendors, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)



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


class IssueBagsView(APIView):
	'''
	This endpoint allows vendors to issue bags. The issued bags will be automatically associated with the vendor who issued them.
	Format:
	{
		"num_bags": [Int],
		"collection_time": [String],
	}
	'''
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		user = request.user
		if user.role != UserModel.Role.VENDOR:
			return Response({"message":"You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)


		bags = BagModel.objects.filter(vendor=user)
		serializer = BagsSerializer(bags, many=True)
		return Response({'bags': serializer.data}, status=status.HTTP_200_OK)


	def post(self, request):
		# Oscar Green

		# check if user is a vendor
		if request.user.role != UserModel.Role.VENDOR:
			return Response({"message":"You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)
		# get the vendor
		vendor = request.user
		# get the data
		data = request.data
		num_bags = data['num_bags']
		collection_time = data['collection_time']

		# create the bags
		for i in range(int(num_bags)):
			serializer = BagsSerializer(data={'vendor': vendor, 'collection_time': collection_time})
			if serializer.is_valid(raise_exception=True):
				bag = serializer.create(serializer.validated_data)
				bag.save()

			# todo: create bulk insert functionality

		# update the vendor bags
		VendorModel.objects.filter(id=vendor.id).update(bags_left=vendor.bags_left + num_bags)




		# add bags to vendorModel

		return Response({"Bags Created" : num_bags}, status=status.HTTP_201_CREATED)
	def getVendor(self, vendor_id):
		try:
			return VendorModel.objects.get(id=vendor_id)
		except VendorModel.DoesNotExist:
			raise None

class ClaimsView(APIView):
	'''
	Allows users to see any bags they haven't claimed, and the last 24hrs of bags.
	Format:
	{"bags":
	[
			"bag_id": [Int],
			"collection_time": [String],
			"vendor_id": [Int],
			"claimed": [Boolean]
			],
			...
	}
	'''

	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		user = request.user

		bags = BagModel.objects.filter(user=user)
		serializer = BagsSerializer(bags, many=True)
		return Response({'bags': serializer.data}, status=status.HTTP_200_OK)



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
		# check that user owns the claim
		claim = ClaimModel.objects.get(claim_id=claim_id)
		# check if the claim is already successful
		if not claim:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		print(claim)
		if claim.user_id != user:
			print("User does not own the claim")
			return Response(status=status.HTTP_403_FORBIDDEN)


		questions = []
		for i in range(request.data['q_count']):
			print(f"Question: {request.data['questions'][i]['question_id']}, Answer: {request.data['questions'][i]['answer']}")
			# gets the question and user answer
			questions.append([QuestionModel.objects.get(question_id=request.data['questions'][i]['question_id']),
							  request.data['questions'][i]['answer']])

		print(questions)


class CreateQuestion(APIView):
	'''
	Post:
		{
			"question": [String],
			"answers":
			[ "answer 1", "answer 2"... (unlimited) ]
			,
			"options" :
			[
				"false answer 1", "false answer 2"... (unlimited)
			]
		}

	'''
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		user = request.user
		if user.role != UserModel.Role.ADMIN:
			return Response({"message":"You are not an admin, you cannot create questions"}, status=status.HTTP_403_FORBIDDEN)

		if 'question' and 'answers' and 'options' not in request.data:
			return Response({"message":"You need to provide a question, answers and options"}, status=status.HTTP_400_BAD_REQUEST)
		question = request.data['question']
		answers = request.data['answers']
		options = request.data['options']

		if len(answers) < 1 or len(options) < 1:
			return Response({"message":"You need at least 1 answer and 1 option"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			with transaction.atomic():
				self.createQuestion(question, answers, options)
				return Response({"message":"Question created successfully"}, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({"message":"Error creating question", "Error": e}, status=status.HTTP_400_BAD_REQUEST)
	def createQuestion(self, question, answers, options):
		questionSerializer = QuestionsSerializer(data={'question': question})
		if questionSerializer.is_valid(raise_exception=True):
			question = questionSerializer.create(questionSerializer.validated_data)
			question.save()
		for answer in answers:
			answerSerializer = AnswerSerializer(data={'answer': answer, 'question': question.pk, 'is_correct': True})
			if answerSerializer.is_valid(raise_exception=True):
				answer = answerSerializer.create(answerSerializer.validated_data)
				answer.save()
		for option in options:
			answerSerializer = AnswerSerializer(data={'answer': option, 'question': question.pk, 'is_correct': False})
			if answerSerializer.is_valid(raise_exception=True):
				answer = answerSerializer.create(answerSerializer.validated_data)
				answer.save()

		return 1;


# todo: delete these 2 functions
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


def send_verification_email(request,user):
	email_verification, created = EmailVerification.objects.get_or_create(user=user)
	if not email_verification.is_verified:
		token = email_verification.token
		verification_link = request.build_absolute_uri('/verify-email/') + token + '/'
		subject = "Verify your email address"
		message = render_to_string('verification_email.html', {'verification_link': verification_link})
		send_mail(subject, message, "noreply@ecogo.com", [user.email], fail_silently=False)
		return HttpResponse("Verification email sent.")
	return HttpResponse("Email already verified.")


def verify_email(request, token):
	try:
		email_verification = EmailVerification.objects.get(token=token)
	except EmailVerification.DoesNotExist:
		return HttpResponse("Invalid verification link.")

	if email_verification.is_verified:
		return HttpResponse("Email already verified.")

	email_verification.is_verified = True
	email_verification.save()
	return HttpResponse("Email verified successfully.")