import { useParams } from "react-router-dom";
import { GoBackLink } from "../../components/General/GoBackLink";
import { BagsRemainingIcon } from "../../components/General/BagsRemainingIcon";
import { StandoutButton } from "../../components/General/StandoutButton";
import { TbPaperBag } from "react-icons/tb";
import { Link } from "react-router-dom";

export function OutletPage() {

    const { outlet } = useParams()

    // FETCH THIS OUTLET'S INFO
    const getOutlets = () => {

        // debug
        console.log("getting outlets info ... ")

        // fetch the outlets from the backend
        fetch("http://localhost:8000/api/outlets").then(response => response.json()).then(data => {
            console.log(data)
        })
    }

    return (
        <section className="h-full flex flex-col ">

            <div className="relative h-48 w-full bg-cover bg-center" style={{ backgroundImage:"url(https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png)" }}>
                <div className="absolute top-2 left-2 z-10 shadow">
                    <GoBackLink href={"/"} />
                </div>
            </div>
            
            <div className="p-4 flex flex-col h-full gap-4 justify-between">
                <div className="flex flex-col gap-4">

                    <div className="flex gap-4">
                        <img
                            className="w-20 w-20 rounded-md object-cover"
                            src={"https://pbs.twimg.com/profile_images/1657489733/ram2_400x400.jpg"}
                            alt="Logo of the outlet"
                        />

                        <div>
                            {/* Outlet name */}
                            <h2 className="text-2xl font-semibold">The Ram Bar</h2>
                            {/* Outlet mins walk */}
                            <p className="text-gray-400 text-sm"><span>2</span> mins walk</p>
                        </div>
                    </div>

                    <div className="p-6 border-solid border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center">
                        <BagsRemainingIcon quantity={10} />
                        <p>10 bags remaining</p>
                    </div>
                </div>

                <Link to={"/quiz"} className="flex flex-col">
                    <StandoutButton>
                        <TbPaperBag />
                        <span>Claim a bag</span>
                    </StandoutButton>
                </Link>
            </div>
        
        </section>
    )
}