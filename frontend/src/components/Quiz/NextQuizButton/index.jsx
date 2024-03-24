import { StandoutButton } from "../../General/StandoutButton";



export function NextQuizButton({ setPage, disabled, setAnswer, answer}) {
    return (
		<div className="flex flex-col mt-4 w-full">
			<StandoutButton
				disabled={disabled}
				onClick={() => {
					setAnswer((answers) => {
						return [...answers, answer]
					});
					setPage((page) => {
						return page + 1
					});
				}}>
					Next
			</StandoutButton>
		</div>
		
    )
}