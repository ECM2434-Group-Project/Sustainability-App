import { useParams } from "react-router-dom";
import { GoBackLink } from "../../components/General/GoBackLink";
import { BagsRemainingIcon } from "../../components/General/BagsRemainingIcon";
import { StandoutButton } from "../../components/General/StandoutButton";
import { TbPaperBag } from "react-icons/tb";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export function OutletPage() {
  const { outlet } = useParams();
  const [outletData, setOutletData] = useState({});

  // FETCH THIS OUTLET'S INFO
  useEffect(() => {
    client.get("/api/vendors/" + outlet).then((response) => {
      setOutletData(response.data);
      console.log(response.data.banner);
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
          <GoBackLink href={"/"} />
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
          <Link to={"/quiz"} className="flex flex-col">
            <StandoutButton>
              <TbPaperBag />
              <span>Claim a bag</span>
            </StandoutButton>
          </Link>
        ) : (
          <div className="bg-slate-200 p-4 rounded-lg shadow-sm">
            <p>Sorry, we're all out of bags!</p>
          </div>
        )}
      </div>
    </section>
  );
}
