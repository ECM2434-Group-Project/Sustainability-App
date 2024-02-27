import { Link } from "react-router-dom/dist";
import { IoArrowBackOutline } from "react-icons/io5";


export function GoBackLink({ href }) {
    return (
        <Link to={href} className="h-10 w-10 flex justify-center items-center bg-white rounded-full shadow-md sticky top-4">
            <IoArrowBackOutline />
        </Link>
    )
}