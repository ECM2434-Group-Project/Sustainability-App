import { Link, useNavigate } from "react-router-dom";
import { GoBackLink } from "../../components/General/GoBackLink";
import { StandoutButton } from "../../components/General/StandoutButton";
import { useUser } from "../../contexts/userContext";
import React from "react"


export function SettingsPage(params, props) {

    const nav = useNavigate();

    

    const { user, logout } = useUser();

    return (
        <section className="p-4 flex flex-col gap-8">

            <GoBackLink />

            <div className="flex flex-col gap-4">
                {/* <UserAvatar large={true} /> */}

                <div>
                    <p className="text-gray-500">Logged in as</p>

                    <h1 className="font-semibold text-3xl">{user?.username}</h1>
                </div>
            </div>

            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-4 pb-32">

                    {
                        user.role !== "ADMIN" ? (
                            <Link to={"/settings/change-password"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Change Password</Link>
                        ) : (
                            <></>
                        )
                    }

                    {
                        user.role !== "ADMIN" ? (
                            <Link to={"/settings/change-username"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Change Username</Link>
                        ) : (
                            <></>
                        )
                    }

                    

                    

                    {
                        user.role !== "ADMIN" && user.role !== "VENDOR" ? (
                            <Link to={"/leaderboard"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Leaderboard</Link>
                        ) : (
                            <></>
                        )
                    }

                    {
                        user.role !== "ADMIN" && user.role !== "VENDOR" ? (
                            <Link to={"/view-claim"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Claims</Link>
                        ) : (
                            <></>
                        )
                    }
                    

                    <Link to={"/privacy-policy"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Privacy Policy</Link>

                    <Link to={"/terms-and-conditions"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Terms and Conditions</Link>

                    {
                        user.role !== "ADMIN" && user.role !== "VENDOR" ? (
                            <Link to={"/delete-account"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-white bg-red-600">Delete account</Link>
                        ) : (
                            <></>
                        )
                    }
                    

                </div>

                <StandoutButton onClick={() => {
                    if (logout()) {
                        nav("/")
                    } else {
                        console.error("Could not log out")
                    }
                
                }} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Log out</StandoutButton>

            </div>


        </section>
    )
}