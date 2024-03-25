import { StandoutButton } from "../../General/StandoutButton";


export function SubmitButton({ disabled, setAnswer, answer}) {
    return (
		<div className="flex flex-col fixed left-4 right-4 bottom-4">
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