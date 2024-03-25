import { StandoutButton } from "../../General/StandoutButton";



export function NextQuizButton({ setPage, disabled, setAnswer, answer}) {
    return (
		<div className="flex flex-col fixed left-4 right-4 bottom-4">
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