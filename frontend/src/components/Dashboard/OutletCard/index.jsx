import { Link } from "react-router-dom";
import { BagsRemainingIcon } from "../../General/BagsRemainingIcon";
import { useUser } from "../../../contexts/userContext";
import { useEffect } from "react";

export function OutletCard({ vendor }) {

    const { location } = useUser()

    const checkDistance = (lat1, lon1, lat2, lon2) => {

        console.log(lat1, lon1, lat2, lon2)

		var R = 6371; // km
		var dLat = toRad(lat2-lat1);
		var dLon = toRad(lon2-lon1);
		lat1 = toRad(lat1);
		lat2 = toRad(lat2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;

		return d;
		

		// Converts numeric degrees to radians
		function toRad(Value) {
			return Value * Math.PI / 180;
		}
	}

    useEffect(() => {
        console.log("loaded in the location")
        console.log(location)
    }, [location])

    return location ? (
        <Link to={"/outlet/" + vendor.id} className="rounded-2xl border-[1px] border-gray-200 border-solid overflow-hidden shadow-md">
        <div className="">
            {/* BG image */}
            <img
                className="w-full h-32 object-cover"
                src={"https://"+ process.env.REACT_APP_BACKEND_HOSTNAME + vendor.banner} alt="Background of the outlet" />
        </div>

        <div className="p-4 flex flex-col gap-4">
            <div className="flex gap-4 items-center">

                {/* Vendor Logo */}
                <img
                    className="w-10 h-10 rounded-md object-cover"
                    src={"https://"+ process.env.REACT_APP_BACKEND_HOSTNAME + vendor.icon}
                    alt="Logo of the outlet"
                />

                <div className="flex flex-col">
                    {/* Vendor name */}
                    <h3 className="text-xl font-semibold">{vendor.first_name}</h3>
                    {/* Vendor distance away */}
                    <p className="text-gray-400 text-sm">
                        <span>{(60*checkDistance(location.latitude, location.longitude, vendor.latitude, vendor.longitude)/3).toFixed(2)}</span>
                        <span> min walk</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <BagsRemainingIcon quantity={vendor.bags_left} />
            </div>
        </div>
    </Link>
    ) : (
        <></>
    )
}