from django.urls import path
from . import views
from .views import send_verification_email, verify_email, getimage

urlpatterns = [

	## User Login and Management

	path('register', views.UserRegister.as_view(), name='register'), # register a user
	path('login', views.UserLogin.as_view(), name='login'), # login a user
	path('logout', views.UserLogout.as_view(), name='logout'), # logout a user
	path('user', views.UserView.as_view(), name='user'), # see user info for logged in user
	path('user/deleteuser', views.DeleteUser.as_view(), name='deleteuser'), # delete a user
	path('user/updateuser', views.UpdateUser.as_view(), name='update_user'),
	path('send_verification_email/', views.send_verification_email, name='send_verification_email'),
	path('verify_email/<str:token>/', views.verify_email, name='verify_email'),

	## User Stuff

	path('allergens/<int:allergen_id>', views.AllergenView.as_view(), name='allergen'),
	path('claims', views.ClaimsView.as_view(), name='claims'),
	path('makeclaim', views.CreateClaim.as_view(), name='makeclaim'),
	path('vendors', views.VendorsView.as_view(), name='vendors'),  # see all vendors, low fidelity view
	path('vendors/<int:vendor_id>', views.VendorView.as_view(), name='specific-vendor-view'),  # see a specific vendor
	path('leaderboard', views.LeaderboardView.as_view(), name='leaderboard'),
	path('quiz', views.QuizView.as_view(), name='quiz'),
	path('getvendorimage/<str:image_name>', getimage, name='get-image'),

	## Vendor URLs

	path('uploadvendorimage/', views.UploadImageView.as_view(), name='upload-image'),
	path('deletevendorimage/<str:image_name>', views.DeleteImageView.as_view(), name='delete-image'),
	path('vendors/bags/add', views.AddBags.as_view(), name='addbags'),
	path('vendors/bags/remove', views.RemoveBags.as_view(), name='removebags'),
	path('vendors/groups/add', views.AddGroup.as_view(), name='addgroup'),
	path('vendors/groups/remove', views.RemoveGroup.as_view(), name='removegroup'),
	path('vendors/groups' , views.ViewGroups.as_view(), name='baggroup'),
	path('vendors/verifyclaim', views.VerifyClaim.as_view(), name='verifyclaim'),
	path('vendors/claimclaim', views.ClaimClaim.as_view(), name='claimclaim'),
	path('vendors/groups/<int:group_id>', views.GetBagGroups.as_view(), name='baggroup'),

	## Admin URLs

	path('makequestion', views.CreateQuestion.as_view(), name='makequestion'),
	path('createvendor', views.CreateVendor.as_view(), name='createvendor'),

	## Test URLS
	path('geotest', views.GeoFenceTest.as_view(), name='testgeo'),
	path('testvendor', views.CreateTestVendor.as_view(), name='testvendor'),
	path('makeadmin', views.CreateAdmin.as_view(), name='makeadmin'),
	path('questions', views.QuestionsView.as_view(), name='questions'),

]
