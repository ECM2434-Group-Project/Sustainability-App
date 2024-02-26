export function AnswerButton({ answer, setSelected }) {
    return (
		<div className="w-screen flex flex-col">
			<button className="rounded-full p-4 justify-center m-1 border border-exeterDarkGreen hover:bg-exeterHighlightGreen ml-10 mr-10" onClick={
				() => {
					setSelected(true)
				}
			} >{answer}</button>
		</div>
		
    )
}