import { useCallback, useState } from "react";
import { TextInput } from "../../../components/General/TextInput";
import { useUser } from "../../../contexts/userContext";
import { useNavigate } from "react-router-dom";

export function VendorLoginPage() {

	const { login } = useUser();


    const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState();

	const nav = useNavigate()


	const handleSubmit = useCallback(

		// async function for logging in
		async (e) => {
			try {
				e.preventDefault();
				setError(false);
	
				// now login
				const result = await login(email, password)
				
				if (result === true) {
					nav("/vendor-admin")
				} else {
					setError(result)
				}	
			} catch (error) {
				console.error("ERROR")
			}
		},
		[error, email, password]
	);


    return (
        <section className="p-4 h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-16 justify-center h-full">
				<div className="flex flex-col gap-6">
					<h1 className="text-2xl font-bold text-center">Vendor Login</h1>

					<TextInput
						label={"Your Exeter Email"}
						className="rounded-md p-4 py-2 border-[0.8px] border-solid border-gray-400 bg-white text-gray-950"
						type="email"
						placeholder="you@exeter.ac.uk"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<TextInput
						label={"Password"}
						className="rounded-md p-4 py-2 border-[0.8px] border-solid border-gray-400 bg-white text-gray-950"
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
					className="bg-exeterDimRed to-exeterBrightRed text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
					type="submit"
				>
					Login
				</button>
            </form>
        </section>
    )
}