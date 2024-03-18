import { useUser } from "../../contexts/userContext"
import { OutletCard } from "../../components/Dashboard/OutletCard";
import { OnCampusIndicator } from "../../components/Dashboard/OnCampusIndicator";
import { UserAvatar } from "../../components/User/UserAvatar";
import { GoBackLink } from "../../components/General/GoBackLink";
import { useState, useCallback, useEffect } from "react";
import { client } from "../../axios";

export function VendorPage() {

	const { user, locationVerified } = useUser()

	const [outlets, setOutlets] = useState([]);

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
	}, [])

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

				{outlets.sort(({bags_left: prevBagsLeft}, {bags_left: currentBagsLeft}) => currentBagsLeft - prevBagsLeft).map((vendor) => <OutletCard key={vendor.id} id={vendor.id} bgImage={vendor.banner} logoImage={vendor.icon} name={vendor.first_name} walkTime={2} numBags={vendor.bags_left}/>)}
			</div>
		</div>
	)
}
