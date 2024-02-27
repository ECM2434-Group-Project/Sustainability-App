from django.test import TestCase
from math import radians, sin, cos, sqrt, atan2
from backend.user_api.models import *

"""
LocationModel:
    [-] Check if user is in exeter grounds and compare latitude and longitude
UserModel:
    [X] Check if user is created and compare username, first_name, last_name, email, password
    [ ]
VendorModel:
    [X] Check the vendor is created
AdminModel:
    [X] Check admin is created
BagModel:
    [ ] Check bag is created
QuestionModel:
    [ ] Check question is created
AnswerModel:
    [ ] Check answer is created
    [ ] Check answer points to the correct question
    [ ] Check multiple answers point to one question
ClaimModel:
    [ ] Check claim is created 
"""


class UserTestCase(TestCase):
    def setUp(self):
        UserModel.objects.create(username="testuser", first_name="test", last_name="user", email="test@gmail.com",
                                 password="1234567890")

    def test_user(self):
        user = UserModel.objects.get(username="testuser")
        self.assertEqual(user.first_name, "test")
        self.assertEqual(user.last_name, "user")
        self.assertEqual(user.email, "test@gmail.com")
        self.assertEqual(user.password, "1234567890")
        print("User Test Passed")


class LocationTestCase(TestCase):
    def within_radius(self):
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [00.0000, 00.0000, 50.7380, -3.5345])
        radius = 500
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = 6371 * c  # Radius of Earth in kilometers
        self.assertLessEqual(distance, radius, "Object is within the specified radius.")

# Finn
class VendorTestCase(TestCase):
    def setup(self):
        LocationModel.objects.create(latitude=50.7371, longitude=-3.5351, radius=500)
        VendorModel.objects.create(username="testvendor", email="vendor@gmail.com", password="vendor",
                                   location=LocationModel.objects.get(latitude=50.7371))

    def test_vendor(self):
        vendor = VendorModel.objects.get(username="testvendor")
        self.asserEqual(vendor.email, "vendor@gmail.com")
        self.asserEqual(vendor.password, "vendor")
        self.asserEqual(vendor.location.longitude, -3.5351)
        self.asserEqual(vendor.location.radius, 500)


# Finn van Montfort
class AdminTestCase(TestCase):
    def setup(self):
        AdminModel.objects.create(username="testadmin", email="admin@gmail.com", password="admin")

    def test_admin(self):
        admin = AdminModel.objects.get(username="testadmin")
        self.asserEqual(admin.email, "admin@gmail.com")
        self.asserEqual(admin.password, "admin")
        self.assertEqual(admin.permission_level, 0)
