import { StandoutButton } from "../../General/StandoutButton";


export function SubmitButton({ disabled, setAnswer, answer}) {
    return (
		<div className="flex flex-col mb-8">
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