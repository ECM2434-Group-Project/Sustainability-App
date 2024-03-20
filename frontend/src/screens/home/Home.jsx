import React, { useCallback, useState, useEffect } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { StandoutButton } from "../../components/General/StandoutButton";
import { MdLocationOn } from "react-icons/md";

import { UserClaimView } from "../../components/User/UserClaimView";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { client } from "../../axios";
import GDPR from "../../components/General/GDPR";

// Based on state passed in which contains if logged in or not, display the home page with a login and register button

export default function Home() {

    const nav = useNavigate()

    const { user, locationVerified, refreshLocation } = useUser()

    const [userHasClaim, setUserHasClaim] = useState(true);


    return (
        <section className="h-full flex flex-col justify-between p-4">
            {
                user ? (
                    <>

                        <div className="flex justify-end">
                            <UserAvatar />
                        </div>

                        <div>
                            <h1
                                className="text-4xl font-semibold text-gray-700"
                            >Welcome back, {user?.first_name}</h1>
                        </div>

                        {
                            userHasClaim ? (
                                <div className="h-full pt-8">
                                    {/* <UserClaimView /> */}
                                </div>
                            ) : (
                                <></>
                            )
                        }

                        <div className="text-center flex flex-col gap-3">
                            <StandoutButton onClick={async () => {
                                if (locationVerified) {
                                    nav("/outlet")
                                }
                            }}>
                                <MdLocationOn />
                                <span>Check my location</span>
                            </StandoutButton>
                            <small>You must be on campus to claim food</small>
                        </div>
                    </>
                ) : (
                    <>

                        <br />

                        <div className="text-center">
                            <div className="flex justify-center">
                                <img
                                    src="/logo.jpeg"
                                    alt="RePlate"
                                    className="w-128 h-64 object-cover rounded-full"
                                />
                            </div>
                            <h1
                                className="text-4xl font-semibold text-gray-700"
                            >Welcome!</h1>
                            <p>You must login to continue</p>
                        </div>

                        <div className="text-center flex flex-col gap-3">
                            <StandoutButton onClick={() => {
                                nav("/login")
                            }}>
                                <span>Log in / Register</span>
                            </StandoutButton>
                        </div>
                    </>
                )
            }
            <GDPR />
        </section>
    )
}