from django.urls import path
from . import views

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'), # register a user
	path('login', views.UserLogin.as_view(), name='login'), # login a user
 	path('logout', views.UserLogout.as_view(), name='logout'), # logout a user
	path('user', views.UserView.as_view(), name='user'), # see user info for logged in user


	path('vendors', views.VendorsView.as_view(), name='vendors'), # see all vendors, low fidelity view
    path('vendors/<int:vendor_id>', views.VendorView.as_view(), name='specific-vendor-view'), # see a specific vendor


	path('vendors/issuebags', views.IssueBagsView.as_view(), name='vendors'),
	path('claims', views.ClaimsView.as_view(), name='claims'),

	path('questions', views.QuestionsView.as_view(), name='questions'),
	path('leaderboard', views.LeaderboardView.as_view(), name='leaderboard'),
	path('submit/<int:id_bag>', views.UserView.as_view(), name='user'),
	path('quiz', views.QuizView.as_view(), name='quiz'),
	path('makeadmin', views.CreateAdmin.as_view(), name='makeadmin'),
	path('makevendor', views.CreateVendor.as_view(), name='makevendor'),
	path('makequestion', views.CreateQuestion.as_view(), name='makequestion'),
	path('claims', views.ClaimsView.as_view(), name='claims'),
	path('makeclaim', views.CreateClaim.as_view(), name='makeclaim')
]