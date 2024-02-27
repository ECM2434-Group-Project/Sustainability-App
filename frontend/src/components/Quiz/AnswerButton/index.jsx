/**
 * a button for all the potential answers shown to the user, highlights when clicked
 * 
 * 
 * @param {*} answer the potential answer to the question
 * @param {*} setSelected the state of the button
 * @returns a jsx component that can be loaded into the DOM
 */
export function AnswerButton({ answer, index, selected, setSelected }) {
    return (
		<div className="flex flex-col">
			<button 
				className={
					selected === index ? (
						"rounded-full p-4 justify-center border border-exeterDarkGreen bg-exeterBrightGreen w-full"
					) : (
						"rounded-full p-4 justify-center border border-exeterDarkGreen w-full"
					)
				}
			onClick={
				() => {
					setSelected(index)
				}
			} >{answer}</button>
		</div>
		
    )
}