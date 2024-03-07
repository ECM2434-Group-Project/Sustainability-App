import React from 'react';
import { StandoutButton } from '../../components/General/StandoutButton';
import { useNavigate } from 'react-router-dom';

export function IncorrectLocation() {
    const nav = useNavigate();
    return (
        <div className="flex flex-col items-center pt-20">
            <h1 className="text-2xl font-semibold">Location</h1>
            <p>Unfortunately you are not in the correct location to claim a bag!</p>
            <p>Please travel closer to the outlet and try again!</p>
            <StandoutButton onClick={() => nav("/outlet")}>
                <span>Try again</span>
            </StandoutButton>
        </div>
    )
}