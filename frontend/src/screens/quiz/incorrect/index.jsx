import React, { useEffect, useState } from "react";
import { StandoutButton } from "../../../components/General/StandoutButton";
import { useNavigate } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";

/**
 * the complete page shown after the quiz is completed
 * 
 * @returns screen that displays when the user has completed the quiz
 */
export default function Incorrect() {
    const nav = useNavigate();
	return (
		<div className="flex flex-col items-center pt-20">
			<div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/"} />
			</div>
			<h1 className="text-2xl font-semibold">Quiz</h1>
			<p>Unfortunately you answered some questions wrong!</p>
			<p>Click below to try again!</p>
            <StandoutButton onClick={() => nav("/outlet")}>
                <span>Try again</span>
            </StandoutButton>
		</div>
	)
}
