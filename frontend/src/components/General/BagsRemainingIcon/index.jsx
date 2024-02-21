import { TbPaperBag } from "react-icons/tb";

export function BagsRemainingIcon({ quantity }) {
    return (
        <div className="text-5xl relative w-min text-gray-600">
            
            <TbPaperBag />

            <div className="absolute right-[-5px] bottom-[-5px] bg-gray-200 bg-opacity-90 rounded-full p-1 text-sm font-bold">
                <span>{quantity}</span>
            </div>
        </div>
    )
}