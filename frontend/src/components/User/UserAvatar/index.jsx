import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/userContext";

export function UserAvatar({ large=false }) {

    const { user } = useUser()

    return user ? (
        <Link
            to={"/settings"}
            style={!large ? { width: "3rem", height: "3rem" } : { width: "8rem", height: "8rem" } }
            className="flex justify-center items-center bg-gray-200 rounded-full border-solid border-[2px] border-exeterDeepGreen"
        >
            <span
                className="w-min h-min text-gray-600 font-bold"
                style={!large ? { fontSize: "1rem" } : { fontSize: "3rem" } }
            >{user.first_name[0] + user.last_name[0]}</span>
        </Link>
    ) : (
        <></>
    )
}