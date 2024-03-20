import { useParams } from "react-router-dom";
import { GoBackLink } from "../../components/General/GoBackLink";
import { BagsRemainingIcon } from "../../components/General/BagsRemainingIcon";
import { StandoutButton } from "../../components/General/StandoutButton";
import { TbPaperBag } from "react-icons/tb";
import { useEffect, useState } from "react";
import { client } from "../../axios";
import { useNavigate } from "react-router-dom";

export function OutletPage() {
  const { outlet } = useParams();

  const [outletData, setOutletData] = useState({});
  const [allergens, setAllergens] = useState([]);

  const nav = useNavigate();

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
        await client
          .get("/api/allergens/" + outletData.bag_groups[i].allergen)
          .then((response) => {
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
              className="w-20 rounded-md object-cover"
              src={outletData.icon}
              alt="Logo of the outlet"
            />

            <div>
              {/* Outlet name */}
              <h2 className="text-2xl font-semibold">
                {outletData.first_name}
              </h2>
              {/* Outlet mins walk */}
              <p className="text-gray-400 text-sm">
                <span>2</span> mins walk
              </p>
              <p className="text-gray-400 text-m">
                <span>{outletData.bags_left}</span> bags remaining
              </p>
            </div>
          </div>

          {outletData.bag_groups.length > 0 ? (
            outletData.bag_groups.map((bagGroup, index) => (
              <div
                key={index}
                className="p-6 border-solid border-[1px] border-gray-200 flex justify-between gap-4 rounded-lg shadow-sm items-center"
              >
                <BagsRemainingIcon quantity={bagGroup.bags_unclaimed} />
                <h3
                  onClick={() => {
                    alert(
                      "This bag may contain " +
                        Object.keys(allergens[index])
                          .filter((key) => {
                            return allergens[index][key] === true;
                          })
                          .join(", ") +
                        " items"
                    );
                  }}
                  style={{ cursor: "pointer" }}
                  className="text-l font-semibold"
                >
                  {bagGroup.name}
                </h3>
                {bagGroup.bags_unclaimed > 0 ? (
                  <StandoutButton
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition((position) => {
                        nav("/quiz", {
                          state: {
                            vendorID: outletData.id,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            groupID: bagGroup.bag_group_id,
                          },
                        });
                      });
                    }}
                  >
                    <TbPaperBag />
                    <span>Claim a bag</span>
                  </StandoutButton>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <div className="bg-slate-200 p-4 rounded-lg shadow-sm">
              <p>Sorry, we're all out of bags!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
