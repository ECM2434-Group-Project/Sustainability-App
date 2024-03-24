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
                            <span>You must <b className="text-red-600">enable location </b>in settings and you must <b className="text-red-600">be on campus</b> to claim food</span>
                            <small></small>
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
                            <span><Link to={"/admin/login"} className="text-exeterBlue">Admin Login</Link> | <Link to={"/vendor-admin/login"} className="text-exeterBrightRed">Vendor Login</Link></span>
                        </div>
                    </>
                )
            }
            <GDPR />
        </section>
    )
}