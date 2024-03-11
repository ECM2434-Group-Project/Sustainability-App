// import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Register from './screens/register/Register';
import { OutletPage } from './screens/outlet';
import { SettingsPage } from './screens/settings';
import Quiz from './screens/quiz';
import QuizComplete from './screens/quiz/complete';
import { UserProvider } from './contexts/userContext';
import { VendorPage } from './screens/Vendor'
import Incorrect from './screens/quiz/incorrect';
import { ViewClaimPage } from './screens/view-claim';
import { IncorrectLocation } from './screens/incorrect-location';
import { ClaimDetailPage } from './screens/view-claim/claim-detail';
import LeaderboardPage from './screens/leaderboard/leaderboard';
import ChangeUsername from './screens/change-username';
import ChangePassword from './screens/change-password';
function App() {

	// Create a home page that has two buttons, one for login and one for register which navigate to the respective pages
	return (
		<UserProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/outlet" element={<VendorPage />} />
				<Route path="/outlet/:outlet" element={<OutletPage />} />
				<Route path="/quiz" element={<Quiz />} />
				<Route path="/quiz/complete" element={<QuizComplete />} />
				<Route path="/quiz/incorrect" element={<Incorrect />} />
        		<Route path="/view-claim" element={<ViewClaimPage />} />
				<Route path="/incorrect-location" element={<IncorrectLocation />} />
				<Route path="/claim/:claim" element={<ClaimDetailPage />} />
				<Route path="/leaderboard" element={<LeaderboardPage />} />
				<Route path="/settings/change-username" element={<ChangeUsername />} />
				<Route path="/settings/change-password" element={<ChangePassword />} />
			</Routes>
		</UserProvider>
		
	);
}

export default App;