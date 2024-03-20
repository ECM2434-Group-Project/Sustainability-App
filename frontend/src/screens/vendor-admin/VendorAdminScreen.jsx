import { HiOutlineQrcode } from "react-icons/hi";
import { CategoryView } from "../../components/VendorCategoriesView/CategoryView";
import { VendorCategoriesView } from "../../components/VendorCategoriesView";
import { Link, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";
import { useEffect } from "react";


export default function VendorAdminScreen() {

    const { user } = useUser()

    const nav = useNavigate()



    return user ? (
        <section className="flex flex-col gap-4">

            <div className="h-32 relative">
                <Link to={"/vendor-admin/settings"} className="absolute h-10 w-10 flex justify-center items-center bg-white rounded-full top-2 right-2 border-solid border-[1px] border-gray-400">
                    <IoSettingsOutline />
                </Link>
                <img className="h-full w-full object-cover" src={"http://127.0.0.1:8000" + user?.banner} />
            </div>

            <section className="p-4 flex flex-col gap-6 pb-16">

                <div className="flex gap-3 items-center">
                    <img src={"http://127.0.0.1:8000" + user?.icon} alt="Vendor logo" className="w-10 h-10 rounded object-cover" />

                    <div>
                        <small>Logged in as</small>
                        <h2 className="text-3xl font-semibold">{user?.first_name}</h2>
                    </div>
                </div>

                <div>
                    <VendorCategoriesView />
                </div>

                <div className="fixed w-full bottom-0 left-0 flex flex-col px-4 pb-2">
                    <Link
                        to={"/vendor-admin/scan"}
                        className="bg-exeterDimRed to-exeterBrightRed text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                        type="submit"
                    >
                        <HiOutlineQrcode />
                        Scan a claim
                    </Link>
                </div>
            </section>

        </section>
    ) : (
        <Link className="underline" to={"/vendor-admin/login"}>You are not logged in. Please log in</Link>
    )
}