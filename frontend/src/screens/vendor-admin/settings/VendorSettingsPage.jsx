import { Link } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";
import { IoImage, IoKey, IoKeyOutline, IoPerson, IoPersonOutline } from "react-icons/io5";

export function VendorSettingsPage() {
    return (
        <section className="flex flex-col gap-8 h-screen">

            
            <div className="p-4">
                <GoBackLink href={"/vendor-admin"} />
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

                    <Link to={"/vendor-admin/settings/change-password"} className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center">
                        <span>Change password</span>
                        <IoKeyOutline />
                    </Link>

                </div>
            </div>


        </section>
    )
}