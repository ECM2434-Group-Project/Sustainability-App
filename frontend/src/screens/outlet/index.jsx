import { useParams } from "react-router-dom";
import { GoBackLink } from "../../components/General/GoBackLink";
import { BagsRemainingIcon } from "../../components/General/BagsRemainingIcon";
import { StandoutButton } from "../../components/General/StandoutButton";
import { TbPaperBag } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../axios";
import { useNavigate } from "react-router-dom";

export function OutletPage() {

	const { outlet } = useParams();

	const [outletData, setOutletData] = useState({});

  const nav = useNavigate();

	// FETCH THIS OUTLET'S INFO
	useEffect(() => {
		client.get("/api/vendors/" + outlet).then((response) => {
			setOutletData(response.data);
		});
	}, []);

	if (outletData.id === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<section className="h-full flex flex-col ">
			<div
				className="relative h-48 w-full bg-cover bg-center"
				style={{ backgroundImage: "url(" + outletData.banner + ")" }}
			>
				<div className="absolute top-2 left-2 z-10 shadow">
					<GoBackLink href={"/outlet"} />
				</div>
			</div>

			<div className="p-4 flex flex-col h-full gap-4 justify-between">
				<div className="flex flex-col gap-4">
					<div className="flex gap-4">
						<img
							className="w-20 w-20 rounded-md object-cover"
							src={
								"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"
							}
							alt="Logo of the outlet"
						/>

						<div>
							{/* Outlet name */}
							<h2 className="text-2xl font-semibold">{outletData.username}</h2>
							{/* Outlet mins walk */}
							<p className="text-gray-400 text-sm">
								<span>2</span> mins walk
							</p>
						</div>
					</div>

					<div className="p-6 border-solid border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center">
						<BagsRemainingIcon quantity={outletData.bags_left} />
						<p>{outletData.bags_left} bags remaining</p>
					</div>
				</div>

				{outletData.bags_left > 0 ? (
					<StandoutButton onClick={() => {
            const location = navigator.geolocation.getCurrentPosition((position) => {
              nav("/quiz", {state: {vendorID: outletData.id, latitude: position.coords.latitude, longitude: position.coords.longitude}})
            })
          }}>
            <TbPaperBag />
            <span>Claim a bag</span>
        </StandoutButton>
				) : (
					<div className="bg-slate-200 p-4 rounded-lg shadow-sm">
						<p>Sorry, we're all out of bags!</p>
					</div>
				)}
			</div>
		</section>
	);
}
