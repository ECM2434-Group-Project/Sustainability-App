from django.contrib.auth import login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .decorators import allowed_users
from .models import UserModel, VendorModel, AdminModel, LocationModel
from .serializers import *
from rest_framework import permissions, status
from .validations import *
from .backends import VendorModelBackend, AdminModelBackend

import datetime

from . import geofencing


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
            return Response({"message": "Email is missing", "Data-Sent": data}, status=status.HTTP_400_BAD_REQUEST)

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
            user = vendor_backend.authenticate(request, username=username, password=password, **data)
            if user is not None:
                login(request, user)
                return Response({"message": "Logged in successfully as vendor"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)

        # try admin account
        try:
            admin_backend = AdminModelBackend()

            username = UserModel.objects.get(email__exact=email).username
            user = admin_backend.authenticate(None, username, password, **data)
            request['username'] = username
            if user is not None:
                login(request, user)
                return Response({"message": "Logged in successfully as admin"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)

        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"message": "You are not logged in"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


# /vendors
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


# /vendor/<int:vendor_id>
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
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)

        bags = BagModel.objects.filter(vendor=user)
        serializer = BagsSerializer(bags, many=True)
        return Response({'bags': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        # Oscar Green

        # check if user is a vendor
        if request.user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)
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

        return Response({"Bags Created": num_bags}, status=status.HTTP_201_CREATED)

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
    Get:

    Post:
    {
    "questions" :
        [
            {
                "question_id" : [Int],
                 "answer_id" : [Int]
             },
             ...
         ]
    }
'''


    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        if not request.user:
            return Response({"message": "You are not logged in"}, status=status.HTTP_403_FORBIDDEN)

        user = request.user
        if user.role != UserModel.Role.USER:
            return Response({"message": "Only users can perform quizzes, not vendors."},
                            status=status.HTTP_403_FORBIDDEN)

        q_count = 3
        false_positives = 3
        true_positives = 1

        queryset = QuestionModel.objects.all().order_by('?')[:q_count]
        serializer = QuestionsSerializer(queryset, many=True)
        data = serializer.data

        # for each question, get the answers
        for i in range(len(data)):
            question = data[i]
            answers = AnswerModel.objects.filter(question=question['question_id'])

            ## get the correct answer
            correct_answer = answers.filter(is_correct=True).order_by('?')[:true_positives]
            false_answers = answers.filter(is_correct=False).order_by('?')[:false_positives]
            ## use QuizAnswerSerializer to get the answers without revealing the correct answer
            serializer = QuizAnswerSerializer(correct_answer, many=True)
            correct_answer_serialized = serializer.data
            serializer = QuizAnswerSerializer(false_answers, many=True)
            false_answers_serialized = serializer.data

            ## shuffle the answers
            shuffled_answers = correct_answer_serialized + false_answers_serialized

            data[i]['answers'] = shuffled_answers

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        '''
        Get quiz from user:

        {
        "latitude" : [Float],
        "longitude" : [Float],
        "vendor_id" : [Int],
        "quiz" :
        [
            {
                "question_id" : [Int],
                "answer_id" : [Int]
            },
            ...
        ]
        }

        :param request:
        :return:
        '''
        data = request.data

        user = request.user
        if user.role != UserModel.Role.USER:
            return Response({"message": "You are not a user, you cannot submit a quiz"},
                            status=status.HTTP_403_FORBIDDEN)

        if 'quiz' and 'vendor_id' not in request.data:
            return Response({"message": "You need to provide a quiz and a vendor_id"},
                            status=status.HTTP_400_BAD_REQUEST)

        if 'latitude' and 'longitude' not in request.data:
            return Response({"message": "You need to provide a latitude and a longitude"},
                            status=status.HTTP_400_BAD_REQUEST)

        if not self.isLocationValid(data['latitude'], data['longitude'], data['vendor_id']):
            return Response({
                                "message": "You are not in the correct location to submit a quiz, you need to be on site to submit a quiz (500m from vendor)"},
                            status=status.HTTP_403_FORBIDDEN)

        quiz = data['quiz']
        vendor_id = data['vendor_id']
        for question in quiz:
            if 'question_id' and 'answer_id' not in question:
                return Response({"message": "You need to provide a question_id and an answer_id for each question."},
                                status=status.HTTP_400_BAD_REQUEST)
            question_id = question['question_id']
            answer_id = question['answer_id']
            question = QuestionModel.objects.get(question_id=question_id)
            answer = AnswerModel.objects.get(answer_id=answer_id)
            if not answer.is_correct:
                return Response({"message": "You have answered a question incorrectly"},
                                status=status.HTTP_200_OK)

        # get the vendor
        print("Quiz Passed!!!")
        return Response({"message": "Not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    def isLocationValid(self, latitude, longitude, vendor_id):
        vendor = VendorModel.objects.get(id=vendor_id)
        location = vendor.location
        locationFence = geofencing.GeoFencing(location)
        testLocation = LocationModel(latitude=latitude, longitude=longitude)
        is_inside = locationFence.is_inside(testLocation, accuracy=0)
        return is_inside


class ClaimsView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		claims = ClaimModel.objects.filter(user_id=request.user)
		serializer = ClaimsSerializer(claims, many=True)
		return Response({'claims': serializer.data}, status=status.HTTP_200_OK)

class CreateClaim(APIView):
	def post(self, request):

		user = UserModel.objects.get(username=request.user.username)
		bag = BagModel.objects.get(bag_id=0)
		time = datetime.datetime.now()
		success = True

		data = {'user': user.id, 'bag': bag.bag_id, 'time': time, 'success': success}
		print(f"{data} \n")

		serializer = ClaimsSerializer(data=data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"message": "You are not an admin, you cannot create questions"},
                            status=status.HTTP_403_FORBIDDEN)

        if 'question' and 'answers' and 'options' not in request.data:
            return Response({"message": "You need to provide a question, answers and options"},
                            status=status.HTTP_400_BAD_REQUEST)
        question = request.data['question']
        answers = request.data['answers']
        options = request.data['options']

        if len(answers) < 1 or len(options) < 1:
            return Response({"message": "You need at least 1 answer and 1 option"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                self.createQuestion(question, answers, options)
                return Response({"message": "Question created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "Error creating question", "Error": e}, status=status.HTTP_400_BAD_REQUEST)

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
        serializer = AdminSerializer(user)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)



class CreateVendor(APIView):
    '''
    Example Vendor:
    {
"email" : "vendor@v.com",
"username" : "MikeysMash",
"password" : "bob12345",
"latitude" :   50.7371 ,
"longitude":    -3.5351
    }
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        return Response({"message": "You cannot make a get request to this page"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if request.user.role != "ADMIN":
            return Response({"message": "You are not an admin"}, status=status.HTTP_403_FORBIDDEN)
        if 'latitude' and 'longitude' not in request.data:
            return Response({"message": "You need to provide a latitude and a longitude"}, status=status.HTTP_400_BAD_REQUEST)

        locationSerializer = LocationSerializer(data=request.data)
        if locationSerializer.is_valid(raise_exception=True):
            location = locationSerializer.create(locationSerializer.validated_data)
            location.save()
            data = request.data
            data['location'] = location.location_id
            data['role'] = "VENDOR"
            serializer = VendorSerializer(data=data)
            if serializer.is_valid(raise_exception=True):



                vendor = serializer.create(serializer.validated_data)
                vendor.save()
                # create location for vendor


                VendorModel.objects.filter(id=vendor.id).update(location=location)

                return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)

        return Response({"message": "Error creating vendor"}, status=status.HTTP_400_BAD_REQUEST)


# class CreateVendor(APIView):
#     permission_classes = (permissions.AllowAny,)
#     authentication_classes = (SessionAuthentication,)
#
#     def post(self, request):
#         username = "vendor"
#         password = "bob12345"
#         email = "vendor1@v.com"
#         latitude = 50.7371
#         longitude = -3.5351
#         radius = 500
#
#         # Exeter coordinates
#         locationSerializer = LocationSerializer(data={'latitude': latitude, 'longitude': longitude, 'radius': radius})
#         if locationSerializer.is_valid(raise_exception=True):
#             location = locationSerializer.create(locationSerializer.validated_data)
#             location.save()
#
#         else:
#             return Response({"message": "Error accesing location"}, status=status.HTTP_400_BAD_REQUEST)
#         vendor = VendorModel.objects.create_user(username, email, password, location=location)
#         vendor.save()
#         # VendorModel.objects.filter(id=vendor.id).update(location=location)
#         serializer = VendorSerializer(vendor)
#
#         return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


class GeoFenceTest(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        # make locaiton model:
        location = LocationModel(latitude=37.7749, longitude=-122.4194)
        location2 = LocationModel(latitude=37.7750, longitude=-122.4150, radius=10)

        locSerializer = LocationSerializer(location)

        locationFence = geofencing.GeoFencing(location)
        distance = locationFence.distance(location2)
        is_inside = locationFence.is_inside(location2, accuracy=0)

        return Response({"location1 radius:": location.radius, "distance": distance, "is_inside": is_inside},
                        status=status.HTTP_200_OK)
# @allowed_users(allowed_roles=['admin'])
