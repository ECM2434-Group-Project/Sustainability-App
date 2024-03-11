from django.urls import path
from . import views
from .views import send_verification_email, verify_email

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'), # register a user
	path('login', views.UserLogin.as_view(), name='login'), # login a user
 	path('logout', views.UserLogout.as_view(), name='logout'), # logout a user
	path('user', views.UserView.as_view(), name='user'), # see user info for logged in user
	path('user/deleteuser', views.DeleteUser.as_view(), name='deleteuser'), # delete a user
	path('vendors', views.VendorsView.as_view(), name='vendors'), # see all vendors, low fidelity view
  path('vendors/<int:vendor_id>', views.VendorView.as_view(), name='specific-vendor-view'), # see a specific vendor
	path('vendors/issuebags', views.IssueBagsView.as_view(), name='vendors'),
	path('allergens/<int:allergen_id>', views.AllergenView.as_view(), name='allergen'),
	path('claims', views.ClaimsView.as_view(), name='claims'),
	path('makeclaim', views.CreateClaim.as_view(), name='makeclaim'),
	path('questions', views.QuestionsView.as_view(), name='questions'),
	path('leaderboard', views.LeaderboardView.as_view(), name='leaderboard'),
	path('quiz', views.QuizView.as_view(), name='quiz'),
	path('makequestion', views.CreateQuestion.as_view(), name='makequestion'),
	path('createvendor', views.CreateVendor.as_view(), name='createvendor'),
	path('makeadmin', views.CreateAdmin.as_view(), name='makeadmin'),
	path('geotest', views.GeoFenceTest.as_view(), name='testgeo'),
	path('testvendor', views.CreateTestVendor.as_view(), name='testvendor'),
	path('geotest', views.GeoFenceTest.as_view(), name='testgeo'),

	path('send_verification_email/', send_verification_email, name='send_verification_email'),
    path('verify_email/<str:token>/', verify_email, name='verify_email'),
	path('uploadvendorimage/', views.UploadImageView.as_view(), name='upload-image'),
	#path('deletevendorimage/<int:pk>/', views.DeleteImageModel.as_view(), name='delete-image'),
]                                 

