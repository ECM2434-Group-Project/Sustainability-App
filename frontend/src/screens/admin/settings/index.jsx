import { IoImage, IoKeyOutline, IoLogOut, IoPerson } from "react-icons/io5";
import { Link } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";
import { useUser } from "../../../contexts/userContext";
import { useNavigate } from "react-router-dom";

export default function AdminSettingsPage() {

	const { logout } = useUser()
    const nav = useNavigate()

	return (
		<section className="flex flex-col gap-8 h-screen">

            <div className="p-4">
                <GoBackLink />
            </div>

            <div className="h-full flex flex-col justify-center p-4">

                <div className="flex flex-col gap-4 pb-32">
                    <button className="bg-white border-[0.8px] shadow border-color border-gray-300 p-4 rounded text-gray-800 flex justify-between items-center" onClick={() => logout().then(() => nav("/admin/login"))}>
                        <span>Log out</span>
                        <IoLogOut />
                    </button>

                </div>
            </div>

        </section>
	)
}