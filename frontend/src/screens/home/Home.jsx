import React from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { StandoutButton } from "../../components/General/StandoutButton";
import { MdLocationOn } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import GDPR from "../../components/General/GDPR";
import { Link } from "react-router-dom";

// Based on state passed in which contains if logged in or not, display the home page with a login and register button

export default function Home() {

    const nav = useNavigate()

    const { user, locationVerified } = useUser()

    return (
        <section className={
            !user ? (
                "h-full flex flex-col justify-between p-4 bg-exeterDarkGreen text-neutral-300"
            ) : (
                "h-full flex flex-col justify-between p-4"
            )}
        >
            {
                user ? (
                    <>

                        <div className="flex justify-end">
                            <UserAvatar />
                        </div>

                        <div>
                            <h1
                                className="text-4xl font-semibold"
                            >Welcome back, {user?.first_name}</h1>
                        </div>

                        <div className="text-center flex flex-col gap-3">
                            <StandoutButton onClick={async () => {
                                if (locationVerified) {
                                    nav("/outlet")
                                } else {
                                    alert("your location is not verified")
                                }
                            }}>
                                <MdLocationOn />
                                <span>See Our Vendors</span>
                                
                            </StandoutButton>
                            <span>You must <b className="text-red-400">enable location </b>in settings and you must <b className="text-red-400">be on campus</b> to claim food</span>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col gap-4 justify-evenly">
                        <div className="text-center">
                            <div className="flex gap-2 justify-center items-center text-white">
                                <img
                                    src="/favicon.ico"
                                    alt="RePlate"
                                    className="h-12"
                                />
                                <h3 className="font-medium text-5xl">RePlate</h3>
                            </div>
                        </div>


                        <div className="text-center flex flex-col gap-3">
                            <StandoutButton onClick={() => {
                                nav("/login")
                            }}>
                                <span>Log in</span>
                            </StandoutButton>
                            <p>No account? <Link className="underline" to={"/register"}>Create one here</Link></p>
                        </div>
                    </div>
                )
            }
            <div>
                <small className="underline text-center flex gap-2 justify-center">
                    <Link to={"/admin/login"} className="text-neutral-300">Admin Login</Link> | <Link to={"/vendor-admin/login"} className="text-neutral-300">Vendor Login</Link>
                </small>
                <GDPR />
            </div>
        </section>
    )
}