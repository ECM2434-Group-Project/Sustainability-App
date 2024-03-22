import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


export function GoBackLink({ href="" }) {

    const history = useNavigate();
    const nav = useNavigate()

    return (
        <button className="h-10 w-10 flex justify-center items-center bg-white rounded-full shadow-md sticky top-4" onClick={() => {
            if(href === "") {
                history(-1)
            } else {
                nav(href)
            }
        }}>
            <IoArrowBackOutline />
        </button>
    )
}