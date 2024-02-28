import { Link, useNavigate } from "react-router-dom";
import { UserAvatar } from "../../components/User/UserAvatar";
import { GoBackLink } from "../../components/General/GoBackLink";
import { StandoutButton } from "../../components/General/StandoutButton";
import { useCallback } from "react";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export function SettingsPage() {

    const nav = useNavigate();

    const handleLogout = useCallback(async(e) => {
        e.preventDefault();
        console.log("logging out")
        client.post("/api/logout", {withCredentials: true}).then((response) => {
            if (response.status === 200) {
                nav("/login");
            }
        }
        ).catch((error) => {
            console.log(error);
        })
    }, [])
    
    return (
        <section className="p-4 flex flex-col gap-8">

            <GoBackLink href={"/"} />

            <div className="flex flex-col gap-4">
                {/* <UserAvatar large={true} /> */}

                <div>
                    <p className="text-gray-500">Logged in as</p>

                    <h1 className="font-semibold text-3xl">Edward Blewitt</h1>
                </div>
            </div>

            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-4 pb-32">

                    <Link to={"/settings/change-password"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Change password</Link>

                    <Link to={"/settings/change-name"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Change name</Link>

                    <Link to={"/settings/change-name"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Leaderboard</Link>

                    <Link to={"/settings/change-name"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Orders</Link>

                </div>

                <StandoutButton onClick={handleLogout} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Log out</StandoutButton>

            </div>


        </section>
    )
}