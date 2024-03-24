import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { client } from "../../axios"
import { StandoutButton } from "../../components/General/StandoutButton"
import { ImSpinner } from "react-icons/im"

export default function VerifyUserPage() {
	const params = useParams()

	const [error, setError]	= useState()
	const [ success, setSuccess ] = useState()
	const [ token, setToken ] = useState()
	const [ loading, setLoading ] = useState(false)
	
	const nav = useNavigate()

	useEffect(() => {
		const token = params.token
		setToken(token)
	}, [])

	const verifyEmail = () => {
		setLoading(true)

		client.get(`/api/verify_email/${token}`, {}).then((response) => {

			// stop the loading icon
			setLoading(false)

			if (response.data === "Invalid verification link.") {

				// show error
				setError("Invalid verification link.")

			} else if (response.data === "Email already verified.") {
				// show error
				setError("Email already verified.")
				
			} else if (response.data === "Email verified successfully.") {
				// navigate to login
				setSuccess(true)

			} else {

				// unknown response
				setError("unknown error")
			}
		}).catch((error) => {
			setError(error.message)
		})

	}

	return (
		<div className="flex flex-col w-screen h-screen justify-center">
			<div className="self-center">
				<h1 className="font-extrabold text-4xl">Click To Verify Your Email</h1>
				

				{
					loading ? (
						<h1> Verifying email <ImSpinner className="animate-spin" size={30}/> </h1>
					) : (
						<>
							{
								error ? (
									<h1 className="text-red-500">{error}</h1>
								) : (
									<>
										{
											success ? (
												<div className="flex flex-col justify-center">
													<h1 className="font-extrabold">Email verified successfully!</h1>
													<StandoutButton onClick={() => nav("/login")}>Login</StandoutButton>
												</div>
											) : (
												<StandoutButton onClick={verifyEmail}>Verify</StandoutButton>
											)
										}
									</>
								)
							}
						</>
					)
				}
			</div>
			
		</div>
	)
}