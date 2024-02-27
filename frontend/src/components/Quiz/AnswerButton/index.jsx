/**
 * a button for all the potential answers shown to the user, highlights when clicked
 * 
 * 
 * @param {*} answer the potential answer to the question
 * @param {*} setSelected the state of the button
 * @returns a jsx component that can be loaded into the DOM
 */
export function AnswerButton({ answer, setSelected }) {
    return (
		<div className="flex flex-col">
			<button className="rounded-full p-4 justify-center border border-exeterDarkGreen hover:bg-exeterBrightGreen w-full" onClick={
				() => {
					setSelected(true)
				}
			} >{answer}</button>
		</div>
		
    )
}