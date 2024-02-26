import { Link } from "react-router-dom";

export function NextQuizButton({ setPage }) {
    return (
		<div className="w-screen flex flex-col mt-4">
			<button className="rounded-full p-2 text-center m-1 border mr-32 ml-32 hover:bg-exeterHighlightGreen" onClick={() => {
				setPage((page) => {
					return page + 1
				})
			}}>
				Next
			</button>
		</div>
		
    )
}