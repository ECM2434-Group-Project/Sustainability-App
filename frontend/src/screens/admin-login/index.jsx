import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../../components/General/TextInput";
import { useUser } from "../../contexts/userContext";



export default function AdminLogin() {
	// Create a login page that has a form with two fields, one for email and one for password
	// The form should have a submit button
	// On submit, the form should make a POST request to /api/login at port 8000 with the email and password in the request body
	// If the request is successful, the user should be redirected to the home page

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState();

	const { user, login } = useUser();

	const nav = useNavigate()

	const handleSubmit = useCallback(

		// async function for logging in
		async (e) => {
			e.preventDefault();
			setError(false);

			// now login
			const result = await login(email, password)
			
			if (result === true) {
				nav("/admin")
			} else {
				setError(result)
			}

		},
		[error, email, password]
	);

	return !user ? (
		<div className="h-screen flex flex-col justify-center p-4  gap-6 w-full">
			<div className="w-1/3 self-center">
				<form onSubmit={handleSubmit} className="flex flex-col gap-16">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl font-bold self-center pb-10">Admin Login</h1>

						<TextInput
							label={"Your Exeter Email"}
							className="rounded-md p-4 py-2 text-gray-950 shadow-md"
							type="email"
							placeholder="you@exeter.ac.uk"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<TextInput
							label={"Password"}
							className="rounded-md p-4 py-2 text-gray-950 shadow-md"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{error ? (
						<p className="p-4 text-center text-red-200">
							Incorrect email or password
						</p>
					) : (
						<></>
					)}

					<button
						className="bg-exeterBlue text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
						type="submit"
					>
						Login
					</button>
				</form>

				<div className="text-center">
					<small>
						<Link to="/register">
							No Account? <span className="underline">create one</span>
						</Link>
					</small>
				</div>
			</div>
			
		</div>
	) : (
		<section className="p-4 text-center flex flex-col items-center">
			<p>You are logged in already</p>
			<Link to={"/"}>Go back home</Link>
		</section>
	)
}
