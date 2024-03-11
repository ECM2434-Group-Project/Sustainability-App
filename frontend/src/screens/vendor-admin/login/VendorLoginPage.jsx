import { useState } from "react";
import { TextInput } from "../../../components/General/TextInput";

export function VendorLoginPage() {

    const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState();


    return (
        <section className="p-4 h-screen">
            <form onSubmit={() => {}} className="flex flex-col gap-16 justify-between h-full">
				<div className="flex flex-col gap-6">
					<h1 className="text-2xl font-bold">Vendor Login</h1>

					<TextInput
						label={"Your Exeter Email"}
						className="rounded-md p-4 py-2 bg-white text-gray-950"
						type="email"
						placeholder="you@exeter.ac.uk"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<TextInput
						label={"Password"}
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