import { Link } from "react-router-dom";
import { UserAvatar } from "../../components/User/UserAvatar";
import { GoBackLink } from "../../components/General/GoBackLink";

export function SettingsPage() {
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

                <Link to={"/settings/change-name"} className="border-[1.2px] border-color border-gray-300 p-4 rounded text-gray-800">Log out</Link>

            </div>


        </section>
    )
}