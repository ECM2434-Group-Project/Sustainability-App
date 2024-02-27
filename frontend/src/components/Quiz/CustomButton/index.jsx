import { StandoutButton } from "../../General/StandoutButton";

export function CustomButton({ callback=()=>{}, disabled, text="Next" }) {
    return (
		<div className="flex flex-col mt-4">
			<StandoutButton
				disabled={disabled}
				onClick={() => {
					callback()
				}}>
					{text}
			</StandoutButton>
		</div>
		
    )
}