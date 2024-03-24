import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { client } from "../../axios"

export default function VerifyUserPage() {
	const params = useParams()

	useEffect(() => {
		const token = params.token

		client.get("/api/verify_email/${token}", {}).then((response) => {
			console.log(response.data)
		}).catch((error) => {
			console.error(error)
		})

	}, [])

	return (
		<div>
			<h1>Verify User</h1>
		</div>
	)
}