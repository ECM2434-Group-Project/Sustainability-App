import { useNavigate } from "react-router-dom";
import { StandoutButton } from "../../General/StandoutButton";
import { useCallback } from "react";



export function SubmitButton({ disabled }) {

	const nav = useNavigate()

	const submitAnswers = useCallback(() => {
		// Submit answers here
	}, [])

    return (
		<div className="flex flex-col">
			<StandoutButton disabled={disabled} onClick={() => nav("/quiz/complete")}>
				Submit
			</StandoutButton>
		</div>
		
    )
}