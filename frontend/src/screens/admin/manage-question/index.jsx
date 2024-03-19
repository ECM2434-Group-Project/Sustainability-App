import { useEffect, useState } from "react"
import { TextInput } from "../../../components/General/TextInput"
import { GoBackLink } from "../../../components/General/GoBackLink"
import { UserAvatar } from "../../../components/User/UserAvatar"
import { client } from "../../../axios"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../../contexts/userContext"
import { NotLoggedIn } from "../../../components/General/NotLoggedIn"
import { NotAdmin } from "../../../components/Admin/NotAdmin"
import { Popup } from "../../../components/General/Popup"
import { QuestionItem } from "../../../components/Admin/QuestionItem"
import { AnswerItem } from "../../../components/Admin/AnswerItem"

export default function ManageQuestionPage() {

	const { user } = useUser()

	// creating questions state
	const [question, setQuestion] = useState("")
	const [answers, setAnswers] = useState([])
	const [options, setOptions] = useState([])

	// manage questions state
	const [questions, setQuestions] = useState([])

	// creating question
	const [editing, setEditing] = useState(false)

	const [changed, setChanged] = useState(false)

	
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
		client.get("/api/questions").then(res => {
			console.log(res.data["questions"])
			setQuestions(res.data["questions"])
		}).catch((err) => {
			console.log(err)
		})
	}, [])


	return user ? (
		<div className="flex flex-col bg-exeterBlue p-4 h-screen">
			<Popup trigger={editing} setTrigger={setEditing} size="large">
				<form className="bg-white p-4 rounded-xl">
					<h1 className="text-2xl">Question</h1>

					<div className="flex gap-5">
						<input className="border rounded-2xl border-black p-2" type="text" value={question.question} onChange={(e) => {
							console.log(question)
							setQuestion((q) => {
								return { ...q, "question": e.target.value }
							})

						}}/>

						<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl" onClick={() => {
							// save the question
						}
						}>Save</button>
					</div>
					

					<h1 className="text-2xl">Answers</h1>
					<div className="flex flex-col gap-2">
						{
							answers?.map((a, index) => {
								return (
									<AnswerItem key={index} answer={a} setAnswer={setAnswers} />
								)
							})
						}
					</div>
				</form>
			</Popup>

			<div className="flex justify-between">
				<GoBackLink  href="/admin"/>

				<UserAvatar />
			</div>

			<div className="flex flex-col w-1/2 h-full">
				<h1 className="text-4xl font-bold w-max pb-8">Manage Questions</h1>
				{
					questions.map((q) => {
						return (
							<QuestionItem question={q} setEditing={setEditing} setQuestion={setQuestion} setAnswers={setAnswers} />
						)
					})
				}
			</div>
		</div>
	) : (
		<NotLoggedIn />
	)
}