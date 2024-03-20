	import { useParams } from "react-router-dom";
	import { GoBackLink } from "../../components/General/GoBackLink";
	import { BagsRemainingIcon } from "../../components/General/BagsRemainingIcon";
	import { StandoutButton } from "../../components/General/StandoutButton";
	import { TbPaperBag } from "react-icons/tb";
	import { useEffect, useState } from "react";
	import { client } from "../../axios";
	import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

export function OutletPage() {
	const { outlet } = useParams();

	const [outletData, setOutletData] = useState({});
	const [allergens, setAllergens] = useState([]);

	const [ selectedGroup, setSelectedGroup ] = useState()

	const nav = useNavigate();

	const { location } = useUser();

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

	// FETCH THIS OUTLET'S INFO
	useEffect(() => {
		client.get("/api/vendors/" + outlet).then((response) => {
			setOutletData(response.data);
		});
	}, []);

	useEffect(() => {
		async function getAllergens() {
			if (outletData.bag_groups === undefined) {
				return;
			}
			for (let i = 0; i < outletData.bag_groups.length; i++) {
				client.get("/api/allergens/" + outletData.bag_groups[i].allergen).then((response) => {
					setAllergens((prevAllergens) => [...prevAllergens, response.data]);
				});
			}
		}
		getAllergens();
	}, [outletData]);

  if (outletData.id === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-4 pb-24">
      <div
        className="relative h-36 w-full bg-cover bg-center"
        style={{ backgroundImage: "url(http://"+ process.env.REACT_APP_BACKEND_HOSTNAME + outletData.banner + ")" }}
      >
        <div className="absolute top-2 left-2 z-10 shadow">
          <GoBackLink href={"/outlet"} />
        </div>
      </div>

      <div className="p-4 flex flex-col h-full gap-4 justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <img
              className="w-20 rounded-md object-cover"
              src={"https://" + process.env.REACT_APP_BACKEND_HOSTNAME + outletData.icon}
              alt="Logo of the outlet"
            />
						<div>
							{/* Outlet name */}
							<h2 className="text-2xl font-semibold">
								{outletData.first_name}
							</h2>
							{/* Outlet mins walk */}
							<p className="text-gray-400 text-sm">
								{
									location ? (
										<span>{(60*checkDistance(location.latitude, location.longitude, outletData.latitude, outletData.longitude)/3).toFixed(2)} mins walk</span>
									) : (
										<></>
									)
								}
							</p>
							{/* <p className="text-gray-400 text-m">
								<span>{outletData.bags_left}</span> bags remaining
							</p> */}
						</div>
					</div>

					<div className="flex flex-col gap-4">
						{
							outletData.bag_groups.length > 0 ? (
								outletData.bag_groups.map((bagGroup, index) => {
									return (
										<div
											key={index}
											className={
												bagGroup.bags_unclaimed > 0 ? (
													selectedGroup === bagGroup?.bag_group_id ? (
														"p-6 border-solid outline-[2px] outline outline-exeterDeepGreen border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center"
													) : (
														"p-6 border-solid border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center"
													)
												) : (
													"p-6 opacity-50 border-solid border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center"
												)
											}
											onClick={() => {
												if(bagGroup.bags_unclaimed > 0) {
													if(selectedGroup === bagGroup.bag_group_id) {
														setSelectedGroup(null)
													} else {
														setSelectedGroup(bagGroup.bag_group_id)
													}
												}
											}}
										>

											<BagsRemainingIcon quantity={bagGroup.bags_unclaimed} />

											<div className="flex-1">
												<h3
													style={{ cursor: "pointer" }}
													className="text-l font-semibold"
												>
													{bagGroup.name}
												</h3>
												<p className="leading-4 text-gray-500">
													<small>
														{
															index in allergens ? (
																Object.keys(allergens[index])
																.filter((key) => {
																	return allergens[index][key] === true;
																})
																.map(key => key.charAt(0).toUpperCase() + key.slice(1).split("_").join(" "))
																.join(", ")
															) : (
																<></>
															)
														}
													</small>
												</p>
											</div>
										</div>
									)
								})
							) : (
								<div className="bg-slate-200 p-4 rounded-lg shadow-sm">
									<p>Sorry, we're all out of bags!</p>
								</div>
							)
						}
					</div>
				</div>
			</div>

			<div className="fixed bottom-0 left-0 px-4 pb-4 w-screen flex flex-col">
				<StandoutButton
					disabled={!selectedGroup}
					onClick={() => {
					navigator.geolocation.getCurrentPosition((position) => {
						nav("/quiz", {
						state: {
							vendorID: outletData.id,
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
							groupID: selectedGroup,
						},
						});
					});
					}}
				>
					<TbPaperBag />
					<span>Claim a bag</span>
				</StandoutButton>
			</div>

		</section>
	);
	}
