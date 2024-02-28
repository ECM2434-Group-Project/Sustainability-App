import React, { useCallback, useState, useEffect } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { StandoutButton } from "../../components/General/StandoutButton";
import { MdLocationOn } from "react-icons/md";
import { OutletCard } from "../../components/Dashboard/OutletCard";
import { OnCampusIndicator } from "../../components/Dashboard/OnCampusIndicator";
import { UserClaimView } from "../../components/User/UserClaimView";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { client } from "../../axios";

// Based on state passed in which contains if logged in or not, display the home page with a login and register button

export default function Home() {
    
    const nav = useNavigate()

    const { user } = useUser()

    const [ locationVerified, setLocationVerified ] = useState(false);
    const [ locationDenied, setLocationDenied ] = useState(false);

    const [ userHasClaim, setUserHasClaim ] = useState(true);

    const [ outletIDs, setOutletIDs ] = useState([]);

    const [outlets, setOutlets] = useState([]);


    // Get the outlet ids then get the outlet data from the at /api/outlets/{id}
    useEffect(() => {
        client.get("/api/vendors").then((response) => { 
            for (let i = 0; i < response.data.length; i++) {
                client.get("/api/vendors/" + response.data[i].id).then((vendor) => {
                    setOutlets(prevOutlets => ([...prevOutlets, vendor.data]));
                })
            }
        })
    }, [])

    const checkLocation = useCallback(() => {

        console.log("clicked")

        const successCallback = (position) => {

            // Check their location here
            setLocationVerified(true)

        }
          
        const errorCallback = (error) => {
            setLocationDenied(true)


            // ONLY HERE FOR DEVELOPMENT BECAUSE A PHONE WILL NOT ALLOW LOCATION ACCESS OVER HTTP
            setLocationVerified(true)

        }
          
        // Get the user's location
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

    }, [ locationVerified, locationDenied ])


    return (
        <section className="h-full flex flex-col justify-between p-4">
            {
                user ? (
                    <>
                        {
                            locationVerified ? (
                                <>

                                    <div className="flex justify-end">
                                        <UserAvatar />
                                    </div>

                                    <div className="sticky top-0">
                                        <OnCampusIndicator />
                                    </div>

                                    <div className="flex flex-col gap-8 pb-4">

                                        <h1 className="text-2xl font-semibold">Food outlets</h1>

                                        {outlets.sort(({bags_left: prevBagsLeft}, {bags_left: currentBagsLeft}) => currentBagsLeft - prevBagsLeft).map((vendor) => <OutletCard key={vendor.id} id={vendor.id} bgImage={vendor.banner} logoImage={vendor.icon} name={vendor.username} walkTime={2} numBags={vendor.bags_left}/>)}
                                    </div>

                                </>
                            ) : (
                                !locationDenied ? (
                                    <>

                                        <div>
                                            <h1
                                                className="text-4xl font-semibold text-gray-700"
                                            >Welcome back, {user.username}</h1>
                                        </div>
                    
                                        {
                                            userHasClaim ? (
                                                <div className="h-full pt-8">
                                                    <UserClaimView />
                                                </div>
                                            ) : (
                                                <></>
                                            )
                                        }
                
                                        <div className="text-center flex flex-col gap-3">
                                            <StandoutButton onClick={checkLocation}>
                                                <MdLocationOn />
                                                <span>Check my location</span>
                                            </StandoutButton>
                                            <small>You must be on campus to claim food</small>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-full flex flex-col justify-center gap-16">
                                            <h1
                                                className="text-2xl font-semibold text-gray-700"
                                            >Without your location, we cannot verify if you are on campus.</h1>
                                            <small className="text-center">Please close the application and try again</small>
                                        </div>
                                    </>
                                )
                            )
                        }
                    </>
                ) : (
                    <>

                        <br />

                        <div className="text-center">
                            <h1
                                className="text-4xl font-semibold text-gray-700"
                            >Welcome!</h1>
                            <p>You must login to continue</p>
                        </div>

                        <div className="text-center flex flex-col gap-3">
                            <StandoutButton onClick={() => nav("/login")}>
                                <span>Log in / Register</span>
                            </StandoutButton>
                        </div>
                    </>
                )
            }
        </section>
    )
}