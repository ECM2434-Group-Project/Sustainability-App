import { useEffect } from "react"

export function QuestionItem({ question, setEditing, setQuestion, setAnswers }) {
	useEffect(() => {
		console.log("from inside")
		console.log(question)
	})
	return (
		<div className="flex border rounded-3xl w-full hover:shadow-lg hover:border-black p-4 bg-white" onClick={() => {
			console.log(question)
			setEditing(true)
			setQuestion(question.question)
			setAnswers(question.answers)
		}}>
			<h1 className="text-3xl">question : {question.question.question}</h1>
		</div>
	)
}