import React, { useCallback, useState, useEffect } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { StandoutButton } from "../../components/General/StandoutButton";
import { MdLocationOn } from "react-icons/md";
import { OutletCard } from "../../components/Dashboard/OutletCard";
import { OnCampusIndicator } from "../../components/Dashboard/OnCampusIndicator";
import { UserClaimView } from "../../components/User/UserClaimView";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

    // Based on state passed in which contains if logged in or not, display the home page with a login and register button

export default function Home() {
    
    const [loggedIn, setLoggedIn] = React.useState(true);

    const [ locationVerified, setLocationVerified ] = useState(false)
    const [ locationDenied, setLocationDenied ] = useState(false)

    const [ userHasClaim, setUserHasClaim ] = useState(true)

    const [ outletIDs, setOutletIDs ] = useState([])

    useEffect(() => {
        client.get("/api/vendors").then(response => {
            // Update the outlets with the IDs of the vendors
            response.data.forEach(vendor => {
                setOutletIDs([...outletIDs, vendor.id]);
                console.log(vendor.id);
            });
        }).then(() => {
            outletIDs.forEach(id => {
                client.get("/api/vendors/" + id).then(response => {
                    console.log(response.data)
                });
            });
        }).catch(error => {
            console.log(error);
        });
    }, []);

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
        <section className="h-full flex flex-col justify-between h-full p-4">
            {
                loggedIn ? (
                    <div className="flex justify-end">
                        <UserAvatar />
                    </div>
                ) : (
                    <></>
                )
            }
            
                
            
            {
                locationVerified ? (
                    <>
                        <div className="sticky top-0">
                            <OnCampusIndicator />
                        </div>

                        <div className="flex flex-col gap-8 pb-4">

                            <h1 className="text-2xl font-semibold">Food outlets</h1>

                            {/* {outlets.map((vendor) => <OutletCard key={vendor.id} id={vendor.id} bgImage={vendor.banner} logoImage={vendor.icon} name={vendor.username} walkTime={2} numBags={vendor.bags_left}/>)} */}

                            {/* <OutletCard
                                id={"the_ram_bar"}
                                name={"The Ram Bar"}
                                walkTime={2}
                                bgImage={"https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"}
                                logoImage={"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"}
                            />

                            <OutletCard
                                id={"the_ram_bar"}
                                name={"The Ram Bar"}
                                walkTime={2}
                                bgImage={"https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"}
                                logoImage={"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"}
                            />

                            <OutletCard
                                id={"the_ram_bar"}
                                name={"The Ram Bar"}
                                walkTime={2}
                                bgImage={"https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"}
                                logoImage={"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"}
                            />

                            <OutletCard
                                id={"the_ram_bar"}
                                name={"The Ram Bar"}
                                walkTime={2}
                                bgImage={"https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"}
                                logoImage={"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"}
                            /> */}

                        </div>

                    </>
                ) : (
                        !locationDenied ? (
                            <>
                                {
                                    loggedIn ? (
                                        <div>
                                            <h1
                                                className="text-4xl font-semibold text-gray-700"
                                            >Welcome back, Edward</h1>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1
                                                className="text-4xl font-semibold text-gray-700"
                                            >Hi there!</h1>
                                        </div>
                                    )
                                }
            
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
            
                
            


        </section>
    )
}