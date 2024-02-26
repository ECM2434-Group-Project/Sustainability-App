import { CollectBagButton } from "../../../components/Quiz/CollectBagButton"
import React, { useEffect, useState } from "react";

export default function Complete() {

	// quantity of bags left
	const [bagQuantity, setBagQuantity] = useState(1)

	return (
		<div className="flex flex-col items-center pt-20">
			<h1 className="text-2xl font-semibold">Quiz</h1>
			<p>Well done, you have completed the quiz!</p>

			{
				bagQuantity > 0 ? (
					<div className="flex flex-col items-center">
						<p>There are still {bagQuantity} bags left! click below to claim yours!</p>
						<CollectBagButton />
					</div>
				) : (
					<p>Sorry, there are no bags left!</p>
				)
			}
		</div>
	)
}
