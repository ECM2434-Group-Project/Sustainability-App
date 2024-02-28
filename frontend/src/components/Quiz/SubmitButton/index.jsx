import { useNavigate } from "react-router-dom";
import { StandoutButton } from "../../General/StandoutButton";
import { useCallback } from "react";



export function SubmitButton({ disabled, setAnswer, answer}) {

	const nav = useNavigate()

	const submitAnswers = useCallback(() => {
		// Submit answers here
	}, [])

    return (
		<div className="flex flex-col">
			<StandoutButton disabled={disabled} onClick={() => {
				setAnswer((answers) => {
					return [...answers, answer]
				});
				}}>
				Submit
			</StandoutButton>
		</div>
		
    )
}