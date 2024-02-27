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