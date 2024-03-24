import { useEffect, useState } from "react"
import { GoBackLink } from "../../../components/General/GoBackLink"
import { UserAvatar } from "../../../components/User/UserAvatar"
import { client } from "../../../axios"
import { useUser } from "../../../contexts/userContext"
import { NotLoggedIn } from "../../../components/General/NotLoggedIn"
import { NotAdmin } from "../../../components/Admin/NotAdmin"
import { Popup } from "../../../components/General/Popup_Desktop"
import { QuestionItem } from "../../../components/Admin/QuestionItem"
import { AnswerItem } from "../../../components/Admin/AnswerItem"

export default function ManageQuestionPage() {

	// the users context
	const { user } = useUser()

	// creating questions state
	const [question, setQuestion] = useState("")
	const [answers, setAnswers] = useState([])

	// manage questions state
	const [questions, setQuestions] = useState([])

	// creating question
	const [editing, setEditing] = useState(false)
	const [creating, setCreating] = useState(false)
	const [creatingError, setCreatingError] = useState(["something here", "something else here"])

	// update ( add 1 ) when there is a change in the database ( to refresh the questions)
	const [changed, setChanged] = useState(0)

	
	// create a question request
	const createQuestion = (e) => {

		// prevent navigation
		e.preventDefault()

		// reset the error
		setCreatingError([])

		// variables for checking integrity
		let oneChecked = false;
		let answerContent = false;
		let questionContetn = false
		let noRepeats = false;


		// only one checked answer
		let counter = 0
		answers.forEach((a) => {
			if (a.is_correct) {
				counter += 1
			}
		})
		if (counter !== 1) {
			setCreatingError(["You must have one correct answer"])
			oneChecked = true;
		}
		
		// content in each answer
		try {
			answers.forEach((a) => {
				if (a.answer === "") {
					setCreatingError((err) => [...err, "You must have content in each answer"])
					answerContent = true;
					throw new Error({"error": "something went wrong"})
				}
			})
		} catch (e) {
			console.log(e)
		}
		

		// content in the question
		if (question.question === "") {
			setCreatingError((err) => [...err, "You must have content in the question"])
			questionContetn = true;
		}

		// no repeat answers
		let answerSet = new Set()
		answers.forEach((a) => {
			answerSet.add(a.answer)
		})

		if (answerSet.size !== answers.length) {
			setCreatingError((err) => [...err, "You must have unique answers"])
			noRepeats = true;
		}

		// return if there is an error ( dont send anything)
		if (oneChecked || answerContent || questionContetn || noRepeats) {
			return
		}

		// send the data

		// extract the correct question
		const correctAnswers = []
		const incorrectAnswers = []

		answers.forEach((a) => {
			if (a.is_correct) {
				correctAnswers.push(a.answer)
			} else {
				incorrectAnswers.push(a.answer)
			}
		})

		const data = { "question": question.question, "answers": correctAnswers , "options" : incorrectAnswers } 

		client.post("/api/makequestion", data).then((res) => {
			// close the popup
			setCreating(false)
			setChanged((chg) => (chg + 1))
		}).catch((error) => {
			// show the error to the user
		})
	}

	// edit a questions content ( question or answers )
	const editQuestion = (e) => {
		e.preventDefault()

		let success = true;

		// check if the question has been modified
		if (question.changed) {

			const data = {"question_id": question.question_id, "new_text": question.question}
			// send the question
			client.post("/api/questions", data).then((res) => {
				// close the popup
				setChanged((chg) => (chg + 1))
				success = true;
			}).catch((error) => {
				// show the error to the user
				success = false;
			})
		}

		// for each answer
		answers.forEach((a) => {
			if (a.changed) {
				const data = {"answer_id": a.answer_id, "new_text": a.answer, "is_correct": a.is_correct}
				// send the question
				client.post("/api/questions", data).then((res) => {
					// close the popup
					setChanged((chg) => (chg + 1))
					
				}).catch((error) => {
					// show the error to the user
					success = false;
				})
			}
		})

		if (success) {
			setEditing(false)
		}
	}

	// remove a question
	const deleteQuestion = () => {
		const data = {"question_id": question.question_id, "delete": true}

		// send the delete request
		client.post("/api/questions", data).then((res) => {
			// close the popup
			setChanged((chg) => (chg + 1))
			setEditing(false)
		}).catch((error) => {
			// show the error to the user
		})
	}

	// load in all the questions
	useEffect(() => {
		client.get("/api/questions").then(res => {
			setQuestions(res.data["questions"])
		}).catch((err) => {
			console.log(err)
		})
	}, [changed])


	return user ? (
		<>
			{
				user.role === "ADMIN" ? (
					<div className="flex flex-col bg-exeterBlue p-4 h-dvh">

						{/* creating questions */}
						<Popup trigger={creating} setTrigger={setCreating} size="large">
							<form className="bg-white p-4 rounded-xl flex flex-col justify-center" onSubmit={createQuestion}>

								<h1 className="text-2xl">Question</h1>

								{/* the question */}
								<div className="flex gap-5">
									<input className="border rounded-2xl border-black p-2" type="text" content={question.question} onChange={(e) => {
										setQuestion((q) => {
											return { ...q, "question": e.target.value }
										})
										

									}}/>
								</div>
								
								<h1 className="text-2xl">Answers</h1>

								{/* each answer */}
								<div className="flex flex-col gap-2">
									{
										answers?.map((a, index) => {
											return (
												<AnswerItem key={index} answer={a} setAnswer={setAnswers} />
											)
										})
									}
								</div>

								{/* errors */}
								<div className="flex flex-col gap-4">
									{
										creatingError.map((e) => {

											return (
												<p className="text-red-500">{e}</p>
											)
										})
									}
								</div>

								<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl mt-2">Create</button>
							</form>
						</Popup>

						{/* editing questions */}
						<Popup trigger={editing} setTrigger={setEditing} size="large">
							<form className="bg-white p-4 rounded-xl flex flex-col justify-center" onSubmit={editQuestion}>
								<h1 className="text-2xl">Question</h1>

								<div className="flex gap-5">
									<input className="border rounded-2xl border-black p-2" type="text" value={question.question} onChange={(e) => {
										setQuestion((q) => {
											return { ...q, "question": e.target.value, "changed": true }
										})

									}}/>
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

								<button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl mt-2">Save</button>

								<button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl mt-2" onClick={() => {
									
									// call the remove question api
									deleteQuestion()
								}}>Delete</button>
							</form>
						</Popup>

						{/* top bar */}
						<div className="flex justify-between">
							<GoBackLink  href="/admin"/>

							<UserAvatar />
						</div>
					
						{/* question editing */}
						<div className="flex flex-col w-1/2 h-full">
							<div className="flex justify-between pb-8">
								<h1 className="text-4xl font-bold w-max ">Manage Questions</h1>
								<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl" onClick={() => {
									setQuestion({question_id: 1, question: 'enter the question here'})
									setAnswers([{answer: "", is_correct: true, answer_id: 1},
												{answer: "", is_correct: false, answer_id: 2},
												{answer: "", is_correct: false, answer_id: 3},
												{answer: "", is_correct: false, answer_id: 4}])
									setCreatingError([])
									setCreating(true)
								}}>Create Question</button>
							</div>
							
							<div className="flex flex-col gap-2">
								{
									questions.map((q) => {
										return (
											<QuestionItem question={q} setEditing={setEditing} setQuestion={setQuestion} setAnswers={setAnswers} />
										)
									})
								}
							</div>
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