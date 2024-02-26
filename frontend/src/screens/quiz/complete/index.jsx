import { CollectBagButton } from "../../../components/Quiz/CollectBagButton"
import React, { useEffect, useState } from "react";

export default function Complete() {



	return (
		<div className="flex flex-col items-center pt-20">
			<h1 className="text-2xl font-semibold">Quiz</h1>
			<p>Well done, you have completed the quiz!</p>
			<p>see if you got the bag!</p>
			<CollectBagButton />
		</div>
	)
}
