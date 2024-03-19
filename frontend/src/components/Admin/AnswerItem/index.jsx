import { useRef } from "react"

export function AnswerItem({ answer, setAnswer }) {
	return (
		<div className="flex gap-4">
			<input className="border rounded-2xl border-black p-2" type="text" value={answer.answer} onChange={(e) => {
				console.log(answer)
				setAnswer((ans) => {
					//update the answer
					
					const a = ans.map(element => {
						console.log(element)
						console.log(answer)
						console.log("----------")
						if (element === answer) {
							element.answer = e.target.value
						}
						return element
					})

					return a

				})
			}}/>
			<input type="checkbox" className="p-2 w-max h-max aspect-square" />
		</div>
	)
}