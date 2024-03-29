import { StandoutButton } from "../../../components/General/StandoutButton";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * the complete page shown after the quiz is completed
 * 
 * @returns screen that displays when the user has completed the quiz
 */
export default function Complete() {
	const nav = useNavigate();
	return (
		<div className="flex flex-col items-center pt-20">
			<h1 className="text-2xl font-semibold">Quiz</h1>
			<p>Well done, you have completed the quiz and claimed a bag!</p>
			<p>Click below to view your claims!</p>
			<StandoutButton onClick={() => {
				nav("/view-claim")
			}
			}>View claims</StandoutButton>
		</div>
	)
}
