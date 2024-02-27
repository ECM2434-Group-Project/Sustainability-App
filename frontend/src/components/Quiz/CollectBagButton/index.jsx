
/**
 * a function component that creates a button to collect the bag after the quiz is completed
 *
 * @returns a jsx component that can be loaded into the DOM
 */
export function CollectBagButton({} ) {

	const collectBag = () => {
		// Collect the bag
		console.log("Bag collected")
	}

    return (
		<div className="w-screen flex flex-col mt-4">
			<button className="rounded-full p-2 text-center m-1 border mr-32 ml-32 hover:bg-exeterHighlightGreen">
				Check
			</button>
		</div>
		
    )
}