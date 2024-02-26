export function  CollectBagButton({} ) {

	const collectBag = () => {
		// Collect the bag
		console.log("Bag collected")
	}

    return (
		<div className="w-screen flex flex-col mt-4">
			<button className="rounded-full p-2 text-center m-1 border mr-32 ml-32 hover:bg-exeterHighlightGreen">
				Collect
			</button>
		</div>
		
    )
}