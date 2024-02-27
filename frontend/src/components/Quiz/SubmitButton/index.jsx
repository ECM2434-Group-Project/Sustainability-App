import { Link } from "react-router-dom";

/**
 * a button that takes the user to the end of the quiz
 * 
 * @param {*} target the target page to navigate to afterwards
 * @param {*} callback a function to call when the button is clicked
 * 
 * @returns a jsx component that can be loaded into the DOM
 */
export function  SubmitButton({ target, callback }) {
    return (
		<div className="w-screen flex flex-col mt-4">
			<Link className="rounded-full p-2 text-center m-1 border mr-32 ml-32 hover:bg-exeterHighlightGreen" to={target}>
				Submit
			</Link>
		</div>
		
    )
}