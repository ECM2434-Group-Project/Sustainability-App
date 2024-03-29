export function AnswerItem({ answer, setAnswer }) {
	return (
		<div className="flex gap-4 overflow-hidden">
			<input type="checkbox" id={answer.answer_id} className="hidden peer" defaultChecked={answer.is_correct}  required="" onChange={() => {

				// update the answer
				setAnswer((ans) => {
					const a = ans.map(element => {
						if (element === answer) {
							element.is_correct = !element.is_correct
							element.changed = true
						}
						return element
					})

					return a
				})
			}}/>
			<label htmlFor={answer.answer_id} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
				<div className="block">
					<div className="w-full text-lg font-semibold">Select</div>
					<div className="w-full text-sm">This represents a correct answer </div>
				</div>
			</label>
			<input className="border rounded-2xl border-black p-2" type="text" value={answer.answer} onChange={(e) => {

				//update the answer
				setAnswer((ans) => {
					const a = ans.map(element => {
						if (element === answer) {
							element.answer = e.target.value
							element.changed = true
						}
						return element
					})

					return a

				})
			}}/>
		</div>
	)
}