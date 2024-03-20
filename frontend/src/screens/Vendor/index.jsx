import { OutletCard } from "../../components/Dashboard/OutletCard";
import { OnCampusIndicator } from "../../components/Dashboard/OnCampusIndicator";
import { UserAvatar } from "../../components/User/UserAvatar";
import { GoBackLink } from "../../components/General/GoBackLink";
import { useState, useCallback, useEffect } from "react";
import { client } from "../../axios";
import { useUser } from "../../contexts/userContext";

export function VendorPage() {

	const [outlets, setOutlets] = useState([]);
	const [onCampus, setOnCampus] = useState(false);
	const { user } = useUser()

	// Get the outlet ids then get the outlet data from the at /api/outlets/{id}
    const getOutlets = useCallback(() => {

        console.log("Getting outlets")
        
        client.get("/api/vendors").then((response) => { 
            for (let i = 0; i < response.data.length; i++) {
                client.get("/api/vendors/" + response.data[i].id).then((vendor) => {
                    setOutlets(prevOutlets => ([...prevOutlets, vendor.data]));
                })
            }
        })

    }, [outlets])

	// Fetch the outlets
	useEffect(() => {
		getOutlets()

		// Check if the user is on campus by using api endpoint
		
	}, [])

	/**
	 * get the users current location
	 */

	return (
		<div className="p-6">

			<div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/"} />
			</div>

			<div className="flex justify-end">
				<UserAvatar />
			</div>

			<div className="sticky top-0">
				<OnCampusIndicator />
			</div>

			<div className="flex flex-col gap-8 pb-4">

				<h1 className="text-2xl font-semibold">Food outlets</h1>

				{outlets.sort(({bags_left: prevBagsLeft}, {bags_left: currentBagsLeft}) => currentBagsLeft - prevBagsLeft).map((vendor) => <OutletCard key={vendor.id} id={vendor.id} bgImage={"http://127.0.0.1:8000" + vendor.banner} logoImage={"http://127.0.0.1:8000" + vendor.icon} name={vendor.first_name} walkTime={2} numBags={vendor.bags_left}/>)}
			</div>
		</div>
	)
}
