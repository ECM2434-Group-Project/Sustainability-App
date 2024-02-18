from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from . import models


UserModel = get_user_model()
BagModel = models.BagModel
VendorModel = models.VendorModel

def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()
    ##
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('choose another email')
    ##
    if not password or len(password) < 8:
        raise ValidationError('choose another password, min 8 characters')
    ##
    if not username:
        raise ValidationError('choose another username')
    return data


def validate_bag(data):
    bagId = data['bag_id']
    vendorId = data['vendor_id'].strip()
    time = data['username'].strip()
    ##
    if not bagId:
        raise ValidationError('enter a bag id')
    ##
    if not vendorId or not VendorModel.objects.filter(vendor_id=vendorId).exists():
        # Maybe order of filter is other way round
        raise ValidationError('choose another password, min 8 characters')
    ##
    if not time:
        # Maybe check that time is later than rn
        raise ValidationError('enter a valid time')
    return data


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('an email is needed')
    return True

def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('choose another username')
    return True

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('a password is needed')
    return True