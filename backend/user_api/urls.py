from django.urls import path
from . import views

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('vendors', views.VendorsView.as_view(), name='vendors'),
    path('vendors/<int:vendor_id>', views.VendorView.as_view(), name='vendors'),
	path('bags', views.BagsView.as_view(), name='bags'),
	path('questions', views.QuestionsView.as_view(), name='questions'),
	path('leaderboard', views.LeaderboardView.as_view(), name='leaderboard'),
	path('submit/<int:id_bag>', views.UserView.as_view(), name='user'),
	path('answer/<int:question_id>', views.AnswerView.as_view(), name='answer')
]