import { OutletCard } from "../../components/Dashboard/OutletCard";
import { OnCampusIndicator } from "../../components/Dashboard/OnCampusIndicator";
import { UserAvatar } from "../../components/User/UserAvatar";
import { GoBackLink } from "../../components/General/GoBackLink";
import { useState, useCallback, useEffect } from "react";
import { client } from "../../axios";

export function VendorPage() {

	const [outlets, setOutlets] = useState([]);
	const [onCampus, setOnCampus] = useState(false);

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

    }, [])

	// Fetch the outlets
	useEffect(() => {
		getOutlets()

		// Check if the user is on campus by using api endpoint
		setOnCampus(true)
		
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
			
			{
				onCampus ? (
					<>
						<div className="sticky top-0">
							<OnCampusIndicator />
						</div>

						<div className="flex flex-col gap-8 pb-4">

							<h1 className="text-2xl font-semibold">Food outlets</h1>

							{outlets.sort(({bags_left: prevBagsLeft}, {bags_left: currentBagsLeft}) => currentBagsLeft - prevBagsLeft).map((vendor) => <OutletCard key={vendor.id} vendor={vendor}/>)}
						</div>
					</>
				) : (
					<div className="bg-red-300 text-white p-4 rounded-xl text-center">
						You are not on campus
					</div>
				)
			}
		</div>
	)
}
