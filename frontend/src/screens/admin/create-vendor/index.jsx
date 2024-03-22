import { useState } from "react"
import { TextInput } from "../../../components/General/TextInput"
import { GoBackLink } from "../../../components/General/GoBackLink"
import { UserAvatar } from "../../../components/User/UserAvatar"
import { client } from "../../../axios"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../../contexts/userContext"
import { NotLoggedIn } from "../../../components/General/NotLoggedIn"
import { NotAdmin } from "../../../components/Admin/NotAdmin"

export default function ManageVendorPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [latitude, setLatitude] = useState("")
	const [longitude, setLongitude] = useState("")
	const [username, setUsername] = useState("")
	const [name, setName] = useState("")


	const [error, setError] = useState([])

	const nav = useNavigate()
	const { user } = useUser()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError([])

		let data = { "email":email, "username":username, "password":password, "latitude":latitude, "longitude":longitude, "first_name": name }

		// create the vendor
		client.post("/api/createvendor", data).then((res) => {
			if (res.status === 201) {
				nav("/admin")
			}
		}).catch((err) => {
			console.log(err.response.data)
			setError(err.response.data)
		})
	}

	return user ? (
		<>
			{
				user.role === "ADMIN" ? (
					<div className="flex flex-col bg-exeterBlue p-4 h-screen justify-center">
						<div className="flex justify-between">
							<GoBackLink  href="/admin"/>

							<UserAvatar />
						</div>

						<div className="flex flex-col w-max p-4 self-center h-full justify-center">
							
							<h1 className="text-4xl font-bold w-max">Create Vendor</h1>

							{
								Object.keys(error).map((key) => {
									return <small className="text-red-600">{key} | {error[key]}</small>
								})
							}

							<form onSubmit={handleSubmit} className="flex flex-col gap-2">
								<TextInput
									label={"Vendor Email"}
									className="rounded-md p-4 py-2 text-gray-950 shadow-md"
									type="email"
									placeholder="you@exeter.ac.uk"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value)
										setError([])
									}}
									required
								/>

								<TextInput
									label={"Vendor Password"}
									className="rounded-md p-4 py-2 text-gray-950 shadow-md"
									type="password"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value)
										setError([])
									}}
									required
								/>

								<div className="flex gap-5">
									<TextInput
										label={"Vendor Latitude"}
										className="rounded-md p-4 py-2 text-gray-950 shadow-md"
										type="text"
										placeholder="52.23424"
										value={latitude}
										onChange={(e) => {
											setLatitude(e.target.value)
											setError([])
										}}
										required
									/>
									<TextInput
										label={"Vendor Longitude"}
										className="rounded-md p-4 py-2 text-gray-950 shadow-md"
										type="text"
										placeholder="-3.219419"
										value={longitude}
										onChange={(e) => {
											setLongitude(e.target.value)
											setError([])
										}}
										required
									/>
								</div>

								<TextInput
									label={"Vendor Username"}
									className="rounded-md p-4 py-2 text-gray-950 shadow-md"
									type="text"
									placeholder="YourUsername1241"
									value={username}
									onChange={(e) => {
										setUsername(e.target.value.replace(/\s/g, ''))
										setError([])
									}}
									required
								/>

								<TextInput
									label={"Vendor Name"}
									className="rounded-md p-4 py-2 text-gray-950 shadow-md"
									type="text"
									placeholder="Wiktors Bar"
									value={name}
									onChange={(e) => {
										setName(e.target.value)
										setError([])
									}}
									required
								/>

								<button className="bg-white text-black flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold hover:shadow-lg" type="submit">
									Create
								</button>
								
							</form>
						</div>
					</div>
				) : (
					<NotAdmin />
				)
			}
		</>	
	) : (
		<NotLoggedIn />
	)
}