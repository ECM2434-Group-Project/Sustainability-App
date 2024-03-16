import { useCallback, useRef, useState } from "react"
import { TextInput } from "../../components/General/TextInput"
import { GoBackLink } from "../../components/General/GoBackLink"
import { UserAvatar } from "../../components/User/UserAvatar"
import { client } from "../../axios"
import { useNavigate } from "react-router-dom"

export default function CreateVendorPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [latitude, setLatitude] = useState("")
	const [longitude, setLongitude] = useState("")
	const [name, setName] = useState("")


	const [error, setError] = useState()

	const nav = useNavigate()

	const handleSubmit = async (e) => {
		console.log(e)

		e.preventDefault()

		let data = { "email":email, "username":name, "password":password, "latitude":latitude, "longitude":longitude }


		client.post("/api/createvendor", data).then((res) => {
			console.log(res)
			if (res.status === 201) {
				nav("/admin")
			}
		}).catch((err) => {
			console.log(err)
			setError(err.response.data)
		})

	}

	return (
		<div className="flex flex-col bg-exeterBlue p-4 h-screen justify-center">
			<div className="flex justify-between">
				<GoBackLink  href="/admin"/>

				<UserAvatar />
			</div>

			<div className="flex flex-col w-max p-4 self-center h-full justify-center">
				<h1 className="text-4xl font-bold w-max">Create Vendor</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
							type="text"
							placeholder="-3.219419"
							value={latitude}
							onChange={(e) => setLatitude(e.target.value)}
							required
						/>
						<TextInput
							label={"Vendor Longitude"}
							className="rounded-md p-4 py-2 text-gray-950 shadow-md"
							type="text"
							placeholder="52.23424"
							value={longitude}
							onChange={(e) => setLongitude(e.target.value)}
							required
						/>
					</div>

					<TextInput
						label={"Vendor Name"}
						className="rounded-md p-4 py-2 text-gray-950 shadow-md"
						type="text"
						placeholder="Wiktors Bar"
						value={name}
						onChange={(e) => setName(e.target.value.replace(/\s/g, ''))}
						required
					/>

					<button className="bg-white text-black flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold hover:shadow-lg" type="submit">
						Create
					</button>
					
				</form>
			</div>
		</div>
	)
}