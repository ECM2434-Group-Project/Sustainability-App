import { Link, useNavigate } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";
import { IoImage, IoKeyOutline, IoLogOut, IoPerson } from "react-icons/io5";
import { useUser } from "../../../contexts/userContext";

export function VendorSettingsPage() {

    const { logout } = useUser()
    const nav = useNavigate()

    return (
        <section className="flex flex-col gap-8 h-screen">

            <div className="p-4">
                <GoBackLink />
            </div>

            <div className="h-full flex flex-col justify-center p-4">

                <div className="flex flex-col gap-4 pb-32">

                    <Link to={"/vendor-admin/settings/change-name"} className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center">
                        <span>Change vendor name</span>
                        <IoPerson />
                    </Link>

                    <Link to={"/vendor-admin/settings/images"} className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center">
                        <span>Change Logo or Banner</span>
                        <IoImage />
                    </Link>

                    <Link to={"/settings/change-password"} className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center">
                        <span>Change password</span>
                        <IoKeyOutline />
                    </Link>

                    <button className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center" onClick={() => logout().then(() => nav("/vendor-admin/login"))}>
                        <span>Log out</span>
                        <IoLogOut />
                    </button>

                </div>
            </div>

        </section>
    )
}