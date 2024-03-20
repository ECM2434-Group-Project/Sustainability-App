import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export function Settings() {
	return (
		<Link to={"/admin/settings"} className="absolute h-10 w-10 flex justify-center items-center bg-white rounded-full top-2 right-2 border-solid border-[1px] border-gray-400">
			<IoSettingsOutline />
		</Link>
	)
}