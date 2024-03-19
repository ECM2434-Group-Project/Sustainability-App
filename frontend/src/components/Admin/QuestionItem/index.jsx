export function QuestionItem({ question, setEditing, setQuestion, setAnswers }) {
	return (
		<div className="flex border rounded-3xl w-full hover:shadow-lg hover:border-black p-4" onClick={() => {
			console.log(question)
			setEditing(true)
			setQuestion(question.question)
			setAnswers(question.answers)
		}}>
			<h1 className="text-3xl">question : {question.name}</h1>
		</div>
	)
}