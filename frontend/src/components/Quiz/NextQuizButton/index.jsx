import { StandoutButton } from "../../General/StandoutButton";



export function NextQuizButton({ setPage, disabled }) {
    return (
		<div className="flex flex-col mt-4">
			<StandoutButton
				disabled={disabled}
				onClick={() => {
					setPage((page) => {
						return page + 1
					})
				}}>
					Next
			</StandoutButton>
		</div>
		
    )
}