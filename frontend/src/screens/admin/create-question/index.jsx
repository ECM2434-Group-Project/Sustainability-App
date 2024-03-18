import { useEffect, useState } from "react"
import { TextInput } from "../../../components/General/TextInput"
import { GoBackLink } from "../../../components/General/GoBackLink"
import { UserAvatar } from "../../../components/User/UserAvatar"
import { client } from "../../../axios"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../../contexts/userContext"
import { NotLoggedIn } from "../../../components/General/NotLoggedIn"
import { NotAdmin } from "../../../components/Admin/NotAdmin"

export default function CreateQuestionPage() {

	const { user } = useUser()

	const [question, setQuestion] = useState("")
	const [answers, setAnswers] = useState([])
	const [options, setOptions] = useState([])

	
	// create a question request
	const createQuestion = () => {
		const data = { "question": question, "answers": answers , "options" : options }

		client.post("/api/makequestion", data).then((res) => {
			// close the popup
		}).catch((error) => {
			// show the error to the user
		})
	}
	// load in all the questions
	useEffect(() => {

	}, [])


	return user ? (
		<div className="flex flex-col bg-exeterBlue p-4 h-screen">
			<div className="flex justify-between">
				<GoBackLink  href="/admin"/>

				<UserAvatar />
			</div>

			<div className="flex flex-col w-max h-full">
				<h1 className="text-4xl font-bold w-max">Create Question</h1>
				{

				}
			</div>
		</div>
	) : (
		<NotLoggedIn />
	)
}