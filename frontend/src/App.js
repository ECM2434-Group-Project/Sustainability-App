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
import VendorAdminScreen from './screens/vendor-admin/VendorAdminScreen';
import { VendorLoginPage } from './screens/vendor-admin/login/VendorLoginPage';
import { VendorScanPage } from './screens/vendor-admin/scan/VendorScanPage';
import { VendorSettingsPage } from './screens/vendor-admin/settings/VendorSettingsPage';
import { VendorChangePassword } from './screens/vendor-admin/settings/change-password/VendorChangePassword';
import ChangeUsername from './screens/change-username';
import ChangePassword from './screens/change-password';
import AdminLogin from './screens/admin-login';
import AdminPage from './screens/admin';
import CreateVendorPage from './screens/create-vendor';
import PrivacyPolicy from './screens/privacy-policy';
import TermsAndConditions from './screens/terms-and-conditions';
import DeleteAccount from './screens/delete-account';
import CreateQuestionPage from './screens/admin/create-question';
import { VendorAccountImages } from './screens/vendor-admin/settings/images/VendorAccountDetails';
import { VendorChangeName } from './screens/vendor-admin/settings/change-name';


function App() {

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
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/admin/create-vendor" element={<CreateVendorPage />} />
				<Route path="/vendor-admin" element={<VendorAdminScreen />} />
				<Route path="/vendor-admin/login" element={<VendorLoginPage />} />
				<Route path="/vendor-admin/scan" element={<VendorScanPage />} />
				<Route path="/vendor-admin/settings" element={<VendorSettingsPage />} />
				<Route path="/vendor-admin/settings/images" element={<VendorAccountImages />} />
				<Route path="/vendor-admin/settings/change-password" element={<VendorChangePassword />} />
				<Route path="/vendor-admin/settings/change-name" element={<VendorChangeName />} />
				<Route path="/settings/change-username" element={<ChangeUsername />} />
				<Route path="/settings/change-password" element={<ChangePassword />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				<Route path="/terms-and-conditions" element={<TermsAndConditions />} />
				<Route path="/delete-account" element={<DeleteAccount/>} />
			</Routes>
		</UserProvider>
		
	);
}

export default App;