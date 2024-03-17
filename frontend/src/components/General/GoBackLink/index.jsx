import { Link } from "react-router-dom/dist";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


export function GoBackLink() {

    let history = useNavigate();
    
    return (
        <button className="h-10 w-10 flex justify-center items-center bg-white rounded-full shadow-md sticky top-4" onClick={() => {
            history(-1)
        }}>
            <IoArrowBackOutline />
        </button>
    )
}