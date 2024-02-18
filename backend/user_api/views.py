from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework import permissions, status
from .validations import *


# SessionAuthentication -> Check if they're in valid session

class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			# Website user needs to be created here
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class NewBagView(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = validate_bag(request.data)
		serializer = BagsSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			bag = serializer.create(clean_data)
			if bag:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
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
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		vendors = VendorModel.objects.all()
		serializer = VendorsSerializer(vendors, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
	def post(self, request):
		# Deny creation of a vendor to non-vendor users
		if not request.user.is_vendor:
			return Response(status=status.HTTP_403_FORBIDDEN)
		data = {
			'name': request.data['name'],
			'num_bags': request.data['num_bags'],
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
	
	
	def put(self, request, vendor_id):

		# Deny non-vendor users from updating a vendor
		if not request.user.is_vendor:
			return Response(status=status.HTTP_403_FORBIDDEN)

		vendor = self.get_object(vendor_id)
		if not vendor:
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		data = {
			'num_bags': request.data['num_bags']
		}
		
		serializer = VendorsSerializer(vendor, data=data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BagsView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		serializer = BagsSerializer(request.data)
		return Response({'bags': serializer.data}, status=status.HTTP_200_OK)


class QuestionsView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		serializer = QuestionsSerializer(request.data)
		return Response({'questions': serializer.data}, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		serializer = LeaderboardSerializer(request.data)
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
		