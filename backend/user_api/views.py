import os

from django.contrib.auth import login, logout
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.db.models import F, Window
from django.db.models.functions import Rank

from .decorators import allowed_users
from .models import UserModel, VendorModel, AdminModel, LocationModel, BagGroupModel, AllergenModel, QuizRecordModel, \
    EmailVerification, ImageModel
from .serializers import *
from rest_framework import permissions, status
from .validations import *
from .backends import VendorModelBackend, AdminModelBackend

import datetime
from random import shuffle
from . import geofencing

# Email verification
from django.core.mail import send_mail
from django.http import HttpResponse
from django.template.loader import render_to_string

# images
import base64
import io
import PIL.Image
from django.conf import settings


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
        data = request.data
        # if email exists and is exeter email, throws exception if it doesn't
        email = data['email']
        assert validate_email_register(data)
        clean_data = user_creation_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            user.role = UserModel.Role.USER
            user.save()

            if user:
                send_verification_email(request, user)
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

        valid = user_login_validation(data)
        # if valid is an Exception
        if valid:
            return Response({"message": str(valid)}, status=status.HTTP_400_BAD_REQUEST)

        # if email exists, throws exception if it doesn't
        email = data['email']
        assert validate_email(data)

        password = data['password']

        # try user account
        try:
            serializer = UserLoginSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                username = UserModel.objects.get(email__exact=email).username
                user = serializer.get_user(username, password)
                if user.email_verified:
                    login(request, user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Email not verified"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)

        # We don't strictly need these (vendor and admin both work for
        # above now, keeping as backup if something unexpected happens)
        try:
            vendor_backend = VendorModelBackend()

            username = UserModel.objects.get(email__exact=email).username
            user = vendor_backend.authenticate(None, username, password, **data)
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
        data = []
        for vendor in vendors:
            location = vendor.location
            data.append({"id": vendor.id,"first_name":vendor.first_name, "username": vendor.username, "latitude": location.latitude,
                         "longitude": location.longitude, "bags_left": vendor.bags_left})

        return Response(data, status=status.HTTP_200_OK)


# /vendor/<int:vendor_id>
class VendorView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, vendor_id):

        if not request.user:
            return Response({"message": "You are not logged in"}, status=status.HTTP_403_FORBIDDEN)
        vendor = VendorModel.objects.filter(id=vendor_id).first()
        if not vendor:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = VendorSerializer(vendor)

        data = serializer.data

        bag_groups = BagGroupModel.objects.filter(vendor=vendor_id)
        bagGroupSerializer = BagGroupSerializer(bag_groups, many=True)

        data["bag_groups"] = bagGroupSerializer.data
        return Response(data, status=status.HTTP_200_OK)

class AddBags(APIView):
    '''
    Format
    {
    "group_id" : [Int],
    "count" : [Int],
    "collection_time" :
    '''

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        if not request.user:
            return Response({"message": "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response({"message": "You must be a Vendor"}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        if 'group_id' not in data or 'count' not in data or 'collection_time' not in data:
            return Response({"message": "Data not valid."}, status=status.HTTP_400_BAD_REQUEST)

        bag_group = BagGroupModel.objects.filter(vendor=user, bag_group_id=data['group_id']).first()

        if not bag_group:
            return Response({"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        bag_group.bags_unclaimed += data['count']
        vendor = VendorModel.objects.filter(id=user.id).first()
        vendor.bags_left += data['count']

        for i in range(data['count']):
            bag = BagModel(collection_time=data['collection_time'], bag_group=bag_group)
            bag.save()

        bag_group.save()
        vendor.save()

        return Response({"message": f"{data['count']} bags added to group {data['group_id']}."}, status=status.HTTP_201_CREATED)


class RemoveBags(APIView):
    '''
    {
        "group_id": [Int],
        "count": [Int]
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)


    def post(self, request):
        if not request.user:
            return Response({"message": "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response({"message": "You must be a Vendor"}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        if 'group_id' not in data or 'count' not in data:
            return Response({"message": "Data not valid."}, status=status.HTTP_400_BAD_REQUEST)

        bag_group = BagGroupModel.objects.filter(vendor=user, bag_group_id=data['group_id']).first()
        group_unclaimed = bag_group.bags_unclaimed
        diff = 0
        if group_unclaimed < data['count']:
            ## delete all unclaimed, and the rest from claimed bags
            diff = data['count'] - group_unclaimed
            bag_group.bags_unclaimed = 0

            for i in range(group_unclaimed):
                bag = BagModel.objects.filter(bag_group=bag_group, claimed=False).first()
                bag.delete()
            for i in range(diff):
                bag = BagModel.objects.filter(bag_group=bag_group, claimed=True).first()
                claim = ClaimModel.objects.filter(bag=bag).first()

                if bag:
                    bag.delete()
                if claim:
                    claim.delete()

        else:
            ## delete count bags
            bag_group.bags_unclaimed -= data['count']
            for i in range(data['count']):
                bag = BagModel.objects.filter(bag_group=bag_group, claimed=False).first()
                bag.delete()

        bag_group.save()

        vendor = VendorModel.objects.filter(id=user.id).first()
        if vendor.bags_left < data['count']:
            vendor.bags_left = 0
        else:
            vendor.bags_left -= data['count']

        vendor.save()




        return Response({
                            "message": f"{data['count']} bags removed from group {data['group_id']}"},
                        status=status.HTTP_200_OK)


class AddGroup(APIView):
    '''
    Format:
    {
    "name" : [str] (max 128),
    "allergens" : { "milk" : true, ...}
    }

    Allergens must be present in the json, regardless if you are using them or not.
    This is to ensure that the allergens are consistent across all groups, and that allergens have been considered.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        if not request.user:
            return Response({"message" : "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response( {"message" : "You must be a Vendor"}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        vendor_id = user.id

        allergendict = parse_allergens(data["allergens"])
        allergenSerializer = AllergenSerializer(data=allergendict)
        if allergenSerializer.is_valid(raise_exception=True):
            allergen = allergenSerializer.create(allergenSerializer.validated_data)
            allergen.save()
        groupdata = {
            "name" : data["name"],
            "vendor" : vendor_id,
            "allergen" : allergen.allergen_id
        }
        groupSerializer = BagGroupSerializer(data=groupdata)
        if groupSerializer.is_valid():
            bagGroup = groupSerializer.create(groupSerializer.validated_data)
            bagGroup.save()

        else:
            return Response( {"message" : "Group data not valid."}, status=status.HTTP_400_BAD_REQUEST)

        return Response( {"message" : f"Group created: {bagGroup.bag_group_id}"}, status=status.HTTP_201_CREATED)

class RemoveGroup(APIView):
    '''
    Format:
    {
    "group_id" : [Int]
    '''


    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        ## this will delete a group, and all bags under it. Not reccomended to do without checking claims first to ensure there are no people with active claims.
        if not request.user:
            return Response({"message": "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response({"message": "You must be a Vendor"}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        vendor_id = user.id

        if 'group_id' not in data:
            return Response( {"message" : "Data not valid."}, status=status.HTTP_400_BAD_REQUEST)

        bagGroup = BagGroupModel.objects.filter(vendor=vendor_id, bag_group_id=data['group_id'])
        bagGroup.delete()
        return Response( {"message" : f"Group {data['group_id']} deleted."}, status=status.HTTP_200_OK)


class ViewGroups(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        if not request.user:
            return Response({"message": "You are not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)

        groups = BagGroupModel.objects.filter(vendor=user)
        serializer = BagGroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IssueBagsView(APIView):
    '''
    This endpoint allows vendors to issue bags. The issued bags will be automatically associated with the vendor who issued them.
    Format:

    {
    "count" :

    {
        "num_bags": [Int],
        "collection_time": [String],
        <allergens>
    }

    Example JSON for post:
    {
    "bags": [
        {
            "bag_group": 1,
            "allergens": {
                "allergen_id": 1,
                "milk": true,
                "eggs": false,
                "fish": false,
                "crustacean": false,
                "tree_nuts": false,
                "peanuts": false,
                "wheat": false,
                "soybeans": false,
                "sesame": false
            },
            "bags": [
                {
                    "bag_id": 1,
                    "collection_time": "2024-02-27T16:32:00Z",
                    "bag_group": 1,
                    "claimed": false
                },
                {
                    "bag_id": 2,
                    "collection_time": "2024-02-27T16:32:00Z",
                    "bag_group": 1,
                    "claimed": false
                }...
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)
        # get bag groups issued to vendor
        bag_groups = BagGroupModel.objects.filter(vendor=user)

        data = []

        # get groups
        for group in bag_groups:
            bags = BagModel.objects.filter(bag_group=group)
            bagserializer = BagSerializer(bags, many=True)
            allergen = AllergenModel.objects.get(allergen_id=group.allergen.allergen_id)
            allergenserializer = AllergenSerializer(allergen)

            data.append(
                {"bag_group": group.bag_group_id, "allergens": allergenserializer.data, "bags": bagserializer.data})

        return Response({'bags': data}, status=status.HTTP_200_OK)

    def post(self, request):
        # Oscar Green

        # check if user is a vendor
        if request.user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)
        # get the vendor
        vendor = request.user
        # get the data
        data = request.data

        # Verification here
        # ==================

        num_bags = data['num_bags']
        collection_time = data['collection_time']
        allergendict = parse_allergens(data)

        # create allergen model
        allergenSerializer = AllergenSerializer(data=allergendict)
        if allergenSerializer.is_valid(raise_exception=True):
            allergen = allergenSerializer.create(allergenSerializer.validated_data)
            allergen.save()

        # create bag group
        bagGroupSerializer = BagGroupSerializer(
            data={'vendor': vendor.id, 'allergen': allergen.allergen_id, 'bags_unclaimed': num_bags})
        if bagGroupSerializer.is_valid(raise_exception=True):
            bagGroup = bagGroupSerializer.create(bagGroupSerializer.validated_data)
            bagGroup.save()

        for i in range(int(num_bags)):
            serializer = BagSerializer(data={'collection_time': collection_time, 'bag_group': bagGroup.bag_group_id})
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




class UsersBagView(APIView):
    '''
    Allows users to see any bags they have claimed, and the last 24hrs of bags.
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
        bag_ids = ClaimModel.objects.filter(user=user).values_list('bag_id', flat=True)
        bags = BagModel.objects.filter(bag_id__in=bag_ids)
        serializer = BagSerializer(bags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)






class QuestionsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        if request.user.role != UserModel.Role.ADMIN:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        questions = QuestionModel.objects.all()

        returndata = {"questions": []}

        for question in questions:
            qdata = {}
            questionserializer = QuestionsSerializer(question)
            answers = AnswerModel.objects.filter(question_id=question.pk)
            qdata["question"] = questionserializer.data
            answersserializer = AnswerSerializer(answers, many=True)
            qdata["answers"] = answersserializer.data
            returndata["questions"].append(qdata)



        return Response(returndata, status=status.HTTP_200_OK)

    def post(self, request):
        """
        {
        "question_id" : [Int],
        "new_text" : [String]
        }
        or
        {
        "answer_id" : [Int],
        "new_text" : [String],
        "is_correct" : [Boolean] (Optional, Will stay the same if not provided)
        }
        or
        {
        "delete" : [boolean],
        "question_id" : [Int]
        or
        "answer_id" : [Int]
        }
        """
        if request.user.role != UserModel.Role.ADMIN:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        if ('question_id' not in request.data) and ('answer_id' not in request.data):
            return Response({"message" : "Invalid Selector"}, status=status.HTTP_400_BAD_REQUEST)

        if ('new_text' not in request.data) and ('delete' not in request.data):
            return Response({"message" : "Invalid Type"}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'delete' in request.data:
            if request.data['delete']:
                if 'question_id' in request.data:
                    question = QuestionModel.objects.filter(question_id=request.data['question_id']).first()
                    question.delete()
                    return Response({"message" : f"Question {question.pk} deleted"}, status=status.HTTP_200_OK)
                elif 'answer_id' in request.data:
                    answer = AnswerModel.objects.filter(answer_id=request.data['answer_id']).first()
                    answer.delete()
                    return Response({"message" : f"Answer {answer.pk} deleted"}, status=status.HTTP_200_OK)
            return Response({"message" : "Nothing deleted, There was some sort of error"}, status=status.HTTP_200_OK)
        
        elif 'question_id' in request.data:
            question = QuestionModel.objects.filter(question_id=request.data['question_id']).first()
            question.question = request.data['new_text']
            question.save()
            return Response({"message" : f"Question {question.pk} updated"}, status=status.HTTP_200_OK)
        
        elif 'answer_id' in request.data:
            answer = AnswerModel.objects.filter(answer_id=request.data['answer_id']).first()
            answer.answer = request.data['new_text']
            if 'is_correct' in request.data:
                answer.is_correct = request.data['is_correct']
            answer.save()
            return Response({"message" : f"Answer {answer.pk} updated"}, status=status.HTTP_200_OK)

        return Response({"message" : "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







class LeaderboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    # If leaderboard has 10 users, user is there, if it has 11, user is the last one
    def get(self, request):
        # Get the top 10 users ordered by score and filter roles
        user = request.user
        user_rank = -1

        if user.role == UserModel.Role.USER:
            # Get the top 10 users ordered by score and filter roles
            leaderboard_queryset = UserModel.objects.filter(role=UserModel.Role.USER).order_by('-score')
            leaderboard = leaderboard_queryset[:10]


            serializer = LeaderboardSerializer(leaderboard, many=True)

            # Check if the user is in the top 10
            if user in leaderboard:
                user_rank = list(leaderboard).index(user) + 1  # Index is 0-based, rank is 1-based
            else:
                # Calculate the user's rank in the full leaderboard
                user_rank = leaderboard_queryset.filter(score__gt=user.score).count() + 1


            returndata = serializer.data

            if user_rank > 10:
                ## add user to the bottom of the leaderboard
                userdata = {"username" : user.username, "score" : user.score}
                returndata.append(userdata)
            # Include the user in the leaderboard data if not already present
        return Response({'leaderboard': returndata, 'user_rank': user_rank}, status=status.HTTP_200_OK)

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

    Post:
    submit a quiz:

        {
        "latitude" : [Float],
        "longitude" : [Float],
        "vendor_id" : [Int],
        "quiz" :
        [
            {
                "question_id" : [Int],
                "answer_id" : [Int]
            },...
            ]}

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
        questions = []
        answers = []
        # for each question, get the answers
        for i in range(len(data)):
            question = data[i]
            answers = AnswerModel.objects.filter(question=question['question_id'])
            questions.append(question['question_id'])

            ## get the correct answer
            correct_answer = answers.filter(is_correct=True).order_by('?')[:true_positives]
            false_answers = answers.filter(is_correct=False).order_by('?')[:false_positives]
            # add answer id to answers

            ## use QuizAnswerSerializer to get the answers without revealing the correct answer
            serializer = QuizAnswerSerializer(correct_answer, many=True)
            correct_answer_serialized = serializer.data
            serializer = QuizAnswerSerializer(false_answers, many=True)
            false_answers_serialized = serializer.data

            ## shuffle the answers
            shuffled_answers = correct_answer_serialized + false_answers_serialized
            shuffle(shuffled_answers)

            data[i]['answers'] = shuffled_answers

        hash = self.getQuizHash(questions, user)
        # create Quiz Record
        quizRecordSerializer = QuizRecordSerializer(data={'quiz_hash': hash})
        if quizRecordSerializer.is_valid(raise_exception=True):
            quizRecord = quizRecordSerializer.create(quizRecordSerializer.validated_data)
            quizRecord.save()

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        '''


        :param request:
        :return:
        '''
        data = request.data

        user = request.user
        if user.role != UserModel.Role.USER:
            return Response({"message": "You are not a user, you cannot submit a quiz"},
                            status=status.HTTP_403_FORBIDDEN)

        if 'quiz' not in request.data and 'vendor_id' not in request.data:
            return Response({"message": "You need to provide a quiz and a vendor_id"},
                            status=status.HTTP_400_BAD_REQUEST)

        if 'latitude' not in request.data and 'longitude' not in request.data:
            return Response({"message": "You need to provide a latitude and a longitude"},
                            status=status.HTTP_400_BAD_REQUEST)

        if not self.isLocationValid(data['latitude'], data['longitude'], data['vendor_id']):
            return Response({
                "message": "You are not in the correct location to submit a quiz, you need to be on site to submit a quiz (500m from vendor)"},
                status=status.HTTP_200_OK)

        # get all question ID's to check if the quiz has actually been issued using Quiz Records
        questions_ids = [x['question_id'] for x in data['quiz']]
        hash = self.getQuizHash(questions_ids, user)
        quiz_record = QuizRecordModel.objects.filter(quiz_hash=hash).first()
        if not quiz_record:
            return Response({"message": "You have not been issued a quiz"}, status=status.HTTP_200_OK)
        else:
            # delete record from the DB
            QuizRecordModel.objects.filter(quiz_hash=hash).delete()

        quiz = data['quiz']
        bag_group = data['bag_group']
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

        # update score by 3
        user.score += 3
        user.save()
        return self.attempt_claim(bag_group, user)

    def attempt_claim(self, bag_group, user):
        ## start transaction
        with transaction.atomic():
            try:

                # get the vendor

                # get the bag
                bag = BagModel.objects.filter(bag_group=bag_group, claimed=False).order_by('-collection_time').first()
                if not bag:
                    return Response({"message": "No bags to claim"}, status=status.HTTP_418_IM_A_TEAPOT)
                # create the claim

                claimSerializer = ClaimSerializer(
                    data={'bag': bag.bag_id, 'user': user.id, 'time': datetime.datetime.now()})
                if claimSerializer.is_valid(raise_exception=True):
                    claim = claimSerializer.create(claimSerializer.validated_data)
                    claim.save()

                    vendor = VendorModel.objects.filter(id=bag.bag_group.vendor.id).first()

                    # remove bag from vendor bags_left
                    VendorModel.objects.filter(id=vendor.id).update(bags_left=vendor.bags_left - 1)
                    # update bag to claimed
                    BagModel.objects.filter(bag_id=bag.bag_id).update(claimed=True)
                    # update group bags_unclaimed

                    BagGroupModel.objects.filter(bag_group_id=bag.bag_group.bag_group_id).update(
                        bags_unclaimed=bag.bag_group.bags_unclaimed - 1)

                    user.score += 2
                    user.save()
                    return Response({"message": "Claim created successfully"}, status=status.HTTP_201_CREATED)
                return Response({"message": "No bags left"}, status=status.HTTP_418_IM_A_TEAPOT)
            except Exception as e:
                return Response({"message": "Error creating claim", "Error": e}, status=status.HTTP_400_BAD_REQUEST)

    def isLocationValid(self, latitude, longitude, vendor_id):
        vendor = VendorModel.objects.get(id=vendor_id)
        location = vendor.location
        fence = geofencing.GeoFencing(location)
        testLocation = LocationModel(latitude=latitude, longitude=longitude)
        return fence.is_inside(testLocation, accuracy=0)

    def getQuizHash(self, questions, user):
        user_id = user.id
        # questions and answers are an array of ints
        # sort lists to be deterministic
        questions.sort()
        # concatenate into string
        questions = ''.join(str(question) for question in questions)

        print("Hashing: " + str(user_id) + questions)
        return hash((user_id, questions))


class ClaimsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    # claims return vendor name
    # bag group name

    def get(self, request):
        if not request.user:
            return Response({"message": "You are not logged in"}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role != UserModel.Role.USER:
            return Response({"message": "Vendors or Admin cannot have claims. Only users can have claims."},
                        status=status.HTTP_403_FORBIDDEN)
        claims = ClaimModel.objects.filter(user_id=request.user)
        serializer = ClaimSerializer(claims, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateClaim(APIView):
    def post(self, request):

        user = UserModel.objects.get(username=request.user.username)
        bag = BagModel.objects.get(bag_id=0)
        time = datetime.datetime.now()
        success = True

        data = {'user': user.id, 'bag': bag.bag_id, 'time': time, 'success': success}
        print(f"{data} \n")

        serializer = ClaimSerializer(data=data)

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

        if 'question' not in request.data or 'answers' not in request.data or 'options' not in request.data:
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


# todo: delete these 2 functions
class CreateAdmin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        username = "admin"
        password = "bob12345"
        email = "admin@admin.com"
        user = AdminModel.objects.create_user(username, email, password)
        user.role = "ADMIN"
        user.email_verified = True
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
        if 'latitude' not in request.data and 'longitude' not in request.data:
            return Response({"message": "You need to provide a latitude and a longitude"},
                            status=status.HTTP_400_BAD_REQUEST)

        locationSerializer = LocationSerializer(data=request.data)
        if locationSerializer.is_valid(raise_exception=True):
            location = locationSerializer.create(locationSerializer.validated_data)
            location.save()
            data = request.data
            # reconfigure models to have matching names
            data['location'] = location.location_id
            data['role'] = "VENDOR"

            serializer = VendorSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                vendor = VendorModel.objects.create_user(username=data['username'], email=data['email'],
                                                         password=data['password'], location=location, role="VENDOR", first_name=data['first_name'], email_verified=True)
                vendor.save()
                # create location for vendor

                VendorModel.objects.filter(id=vendor.id).update(location=location)

                return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)

        return Response({"message": "Error creating vendor"}, status=status.HTTP_400_BAD_REQUEST)


class CreateTestVendor(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        username = "vendor"
        password = "bob12345"
        email = "vendor1@v.com"
        latitude = 50.7371
        longitude = -3.5351
        radius = 500
        # Exeter coordinates
        locationSerializer = LocationSerializer(data={'latitude': latitude, 'longitude': longitude, 'radius': radius})
        if locationSerializer.is_valid(raise_exception=True):
            location = locationSerializer.create(locationSerializer.validated_data)
            location.save()
        else:
            return Response({"message": "Error accesing location"}, status=status.HTTP_400_BAD_REQUEST)
        vendor = VendorModel.objects.create_user(username, email, password, location=location)
        vendor.email_verified = True
        vendor.save()

        # VendorModel.objects.filter(id=vendor.id).update(location=location)
        serializer = VendorSerializer(vendor)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


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
class AllergenView(APIView):
    """
    "/api/allergen/<int:group_id>"
    Returns an allergen from the group id
    """
    permissions_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, group_id):
        try:
            allergen_id = BagGroupModel.objects.get(bag_group_id=group_id).allergen.allergen_id
            allergen = AllergenModel.objects.get(allergen_id=allergen_id)
            serializer = AllergenSerializer(allergen)
        except:
            return Response({"message": f"Group {group_id} Does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        try:

            return Response( serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Error accessing allergen"}, status=status.HTTP_400_BAD_REQUEST)


class DeleteUser(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):

        if not request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data
        if request.user.role == UserModel.Role.ADMIN:
            username = data['username']
            user = UserModel.objects.get(username=username)
            if user.role == UserModel.Role.VENDOR:
                user.delete()
                # Check if user is a vendor if we don't want to be able to delete normal users
                return Response({"message": "User deleted"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Admin can only delete vendors"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        email = data['email']
        password = data['password']
        # verify login details
        user = UserModel.objects.get(email__exact=email)
        if user.check_password(password):
            user.delete()
            return Response({"message": "User deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
          

class VerifyClaim(APIView):
    '''Takes in claim information and verifies that it exsits
    {
    "claim_id" : [Int],
    "user_id" : [Int]
    }


    '''
    def post(self, request):
        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = request.data
        if 'claim_id' not in data and 'user_id' not in data:
            return Response({"message": "You need to provide a claim_id and a user_id"}, status=status.HTTP_400_BAD_REQUEST)
        claim_id = data['claim_id']
        user_id = data['user_id']
        claim = ClaimModel.objects.filter(claim_id=claim_id, user_id=user_id).first()
        if not claim:
            return Response({"message": "Claim does not exist"}, status=status.HTTP_200_OK)
        if claim.success:
            return Response({"message": "Claim has already been claimed."}, status=status.HTTP_200_OK)
        return Response({"message": "Claim exists"}, status=status.HTTP_200_OK)




class ClaimClaim(APIView):
    '''Takes in claim information and claims the claim
    {
    "claim_id" : [Int],
    "user_id" : [Int]
    }
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):

        user = request.user
        if user.role != UserModel.Role.VENDOR:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = request.data
        if 'claim_id' not in data and 'user_id' not in data:
            return Response({"message": "You need to provide a claim_id and a user_id"}, status=status.HTTP_400_BAD_REQUEST)
        claim_id = data['claim_id']
        user_id = data['user_id']
        claim = ClaimModel.objects.filter(claim_id=claim_id, user_id=user_id).first()
        if not claim:
            return Response({"message": "Claim does not exist"}, status=status.HTTP_404_NOT_FOUND)
        if claim.success:
            return Response({"message": "Claim already claimed"}, status=status.HTTP_200_OK)
        claim.success = True
        claim.save()
        return Response({"message": "Claim successful"}, status=status.HTTP_200_OK)


class DeleteBags(APIView):

    """
    Example JSON:
    {
        "bag_group_id": [11,7,3,...]
    }
    """

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        if request.user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        # Data is list of ids to delete
        vendor = request.user
        group = BagGroupModel.objects.filter(vendor=vendor.id)
        # Check that vendor owns the bag groups
        if vendor.id == group.bag_group_id:
            for bagsId in data:
                BagGroupModel.objects.filter(bag_group_id=bagsId).delete()

        BagGroupModel.objects.filter(bag_group_id=group.bag_group_id).update(bags_unclaimed=group.bags_unclaimed - len(data))


# Get bag groups
class GetBagGroups(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, group_id):
        if request.user.role != UserModel.Role.VENDOR:
            return Response({"message": "You are not a vendor"}, status=status.HTTP_403_FORBIDDEN)

        group = BagGroupModel.objects.filter(bag_group_id=group_id)
        serializer = BagGroupSerializer(group, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UploadImageView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    """
    Post
    {'vendorid': [Int]
    'name': [String]
    'type': [String] banner or icon
    'image': [String]
    }
    make sure that image is a base64_encoded_image string
    """
    def post(self, request):
        #=request.vendor.vendor_id) add later
        # Retrieve vendor based on ID
        if (request.user.role != UserModel.Role.VENDOR) and (request.user.role != UserModel.Role.ADMIN):
            return Response({"message": "You are not a vendor or admin"},status=status.HTTP_403_FORBIDDEN)
        # checked vendor id sent is the same as vendor logged in
        elif request.user.role == UserModel.Role.VENDOR:
            try:
                vendor = UserModel.objects.get(id=request.data.get('vendor_id'))
                if not (request.user.id == vendor.id):
                    return Response(Response({"message": "You cannot upload image to a different vendor"},status=status.HTTP_403_FORBIDDEN))
            except VendorModel.DoesNotExist:
                return Response({'error': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)
        elif request.user.role == UserModel.Role.ADMIN:
            try:
                vendor_id = request.data.get("vendor_id")
                vendor = VendorModel.objects.get(id=vendor_id)
            except VendorModel.DoesNotExist:
                return Response({'error': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Decode and save the image
        image_data = request.data["image"]
        # Check if the image is in PNG format
        if image_data.startswith("data:image/png;base64,"):
            image_data = image_data.replace("data:image/png;base64,", "")
            image_filename = f"{vendor.username}_{request.data['type']}.png"
            image_path = os.path.join(settings.MEDIA_ROOT, image_filename)

        # Check if the image is in JPEG format
        elif image_data.startswith("data:image/jpeg;base64,"):
            image_data = image_data.replace("data:image/jpeg;base64,", "")
            image_filename = f"{vendor.username}_{request.data['type']}.jpg"
            image_path = os.path.join(settings.MEDIA_ROOT, image_filename)
        else:
            return Response({'error': 'File type not supported'}, status=status.HTTP_400_BAD_REQUEST)


        # check if path exists
        if os.path.exists(image_path):
            return Response({'error': 'File already exists please delete before you update your image'}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare data for serialization
        data = {'vendor_id': vendor_id, 'name': image_filename, 'image_url': image_path}

        # Serialize and save data + image
        serializer = ImageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            try:
                # Decode and save image
                decoded_image_data = base64.b64decode(image_data)
                image_stream = io.BytesIO(decoded_image_data)
                image = PIL.Image.open(image_stream)
                # Convert the image to RGB mode (remove alpha channel)
                image = image.convert("RGB")
                image.save(image_path)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': 'Image uploaded successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteImageView(APIView):
    """

    Post
    {'vendorid': [Int]
    'name': [String]
    }
    name of the image
    """
    def post(self, request, image_name):

        # Split the filename string using '_' as a delimiter and get the first part
        vendor_username = image_name.split('_')[0]

        if (request.user.role != UserModel.Role.VENDOR) and (request.user.role != UserModel.Role.ADMIN):
            return Response({"message": "You are not a vendor or admin"},status=status.HTTP_403_FORBIDDEN)
        # Check so vendors cannot delete other vendors images
        elif request.user.role == UserModel.Role.VENDOR:
            try:
                vendor = VendorModel.objects.get(id=request.data.get('vendor_id'))
                if not (vendor_username == vendor.username):
                    return Response(Response({"message": "You cannot upload image to a different vendor"},status=status.HTTP_403_FORBIDDEN))
            except VendorModel.DoesNotExist:
                return Response({'error': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)
        elif request.user.role == UserModel.Role.ADMIN:
            try:
                image = ImageModel.objects.get(name=image_name)
            except ImageModel.DoesNotExist:
                return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if image:
            # Delete the associated image file
            os.remove(image.image_url)

            # Delete the ImageModel instance from the database
            image.delete()
            return Response({"message": "Image deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


def resend_verification_email(request, email):
    user = UserModel.objects.get(email__exact=email)
    if not user:
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    if user.email_verified:
        return Response({"message": "Email already verified."}, status=status.HTTP_200_OK)
    else:
        send_verification_email(request, user)
        return Response({"message": "Verification email sent."}, status=status.HTTP_200_OK)


def send_verification_email(request, user):
    email_verification, created = EmailVerification.objects.get_or_create(user=user)
    if not email_verification.is_verified:
        token = email_verification.token
        verification_link = request.build_absolute_uri('verify_email/') + token + '/'
        subject = "Verify your email address"
        message = render_to_string('verification_email.html', {'verification_link': verification_link})
        send_mail(subject, message, "noreply@ecogo.com", [user.email], fail_silently=False)
        return Response("Verification email sent.")
    return Response("Email already verified.")


def verify_email(request, token):
    try:
        email_verification = EmailVerification.objects.get(token=token)
    except EmailVerification.DoesNotExist:
        return Response("Invalid verification link.")

    if email_verification.is_verified:
        return Response("Email already verified.")

    email_verification.is_verified = True
    email_verification.save()
    return Response("Email verified successfully.")

def getimage(request, image_name):
    # Construct the absolute path to the image
    absolute_image_path = os.path.join(settings.MEDIA_ROOT, image_name)

    # Check if the absolute path starts with MEDIA_ROOT to prevent directory traversal
    if not absolute_image_path.startswith(settings.MEDIA_ROOT):
        return HttpResponse({"Error": "Invalid image path"}, status=status.HTTP_400_BAD_BAD_REQUEST)

    # Check if the file exists
    if os.path.isfile(absolute_image_path):
        # Open the file in binary mode
        with open(absolute_image_path, 'rb') as f:
            # Read the file data
            image_data = f.read()

        # Determine the content type based on the file extension
        content_type = 'image/jpeg' if image_name.endswith('.jpg') else 'image/png'

        # Return the image data with the appropriate content type
        return HttpResponse(image_data, content_type=content_type)
    else:
        # Return 404 if the file does not exist
        return HttpResponse({"Image doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

class UpdateUser(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    '''
    Example post request with "new" fields being denoted by "new_" + fieldName: 
    {
        "email" : "bob@exeter.ac.uk",
        "password" : "bob12345",
        "username" : "bob",
        "new_first_name" : "new Name",
        "new_last_name" : "New Last Name"
}'''

    def post(self, request):
        if not request.user:
            return Response({"message": "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        user = request.user
        ## validateUpdateUser(data)

        ## validate email password
        password = data['password']
        user = UserModel.objects.get(email__exact=user.email)
        if not user.check_password(password):
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        keySet = set(data.keys())
        updateFields = {}
        for key in keySet:
            if key.startswith("new_"):
                field = key[4:]
                # Cannot change Email because impossible to have 2 exeter emails
                if field == 'email':
                    return Response({"message": "You cannot change your email address"}, status=status.HTTP_400_BAD_REQUEST)
                updateFields[field] = data[key]

        for field in updateFields:
            # Get the new value for the field from the data dictionary
            new_value = data[f'new_{field}']
            if field == 'password':
                user.set_password(new_value)
            else:
                # Update the user object's attribute with the new value
                setattr(user, field, new_value)

        # performs bulk update on fields
        user.save()

        return Response({"message": f"The following fields have been updated: {updateFields}"},
                                status=status.HTTP_200_OK)



def parse_allergens(data):
    allergendict = {}
    for key in data:
        if key in ['vegan', 'vegetarian','milk', 'eggs', 'fish', 'crustacean', 'tree_nuts', 'peanuts', 'wheat', 'soybeans', 'sesame']:
            allergendict[key] = data[key]
    return allergendict


class DeleteVendor(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        if not request.user:
            return Response({"message" : "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        if request.user.role != UserModel.Role.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = request.data
        vendor_id = data['vendor_id']
        vendor = VendorModel.objects.get(id=vendor_id)
        vendor.delete()
        return Response(status=status.HTTP_200_OK)
