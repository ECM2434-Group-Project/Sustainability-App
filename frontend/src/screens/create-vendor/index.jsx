import { useCallback, useState } from "react"
import { TextInput } from "../../components/General/TextInput"
import { GoBackLink } from "../../components/General/GoBackLink"
import { UserAvatar } from "../../components/User/UserAvatar"

export default function CreateVendorPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const createVendor = useCallback(() => {

	}, [])

	return (
		<div className="flex flex-col bg-exeterBlue p-4 h-screen justify-center">
			<div className="flex justify-between">
				<GoBackLink  href="/admin"/>

				<UserAvatar />
			</div>

			<div className="flex flex-col w-max p-4 self-center h-full justify-center">
				<h1 className="text-4xl font-bold w-max">Create Vendor</h1>

				<form className="flex flex-col gap-2">
					<TextInput
						label={"Vendor Email"}
						className="rounded-md p-4 py-2 text-gray-950 shadow-md"
						type="email"
						placeholder="you@exeter.ac.uk"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<TextInput
						label={"Vendor Password"}
						className="rounded-md p-4 py-2 text-gray-950 shadow-md"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<div className="flex gap-5">
						<TextInput
							label={"Vendor Latitude"}
							className="rounded-md p-4 py-2 text-gray-950 shadow-md"
							type="email"
							placeholder="-3.219419"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<TextInput
							label={"Vendor Longitude"}
							className="rounded-md p-4 py-2 text-gray-950 shadow-md"
							type="email"
							placeholder="52.23424"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<TextInput
						label={"Vendor Name"}
						className="rounded-md p-4 py-2 text-gray-950 shadow-md"
						type="email"
						placeholder="Wiktors Bar"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<button className="bg-white text-black flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold" type="submit">
						Login
					</button>
					
				</form>
			</div>
		</div>
	)
}