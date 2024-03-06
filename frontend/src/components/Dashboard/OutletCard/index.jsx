import { Link } from "react-router-dom";
import { BagsRemainingIcon } from "../../General/BagsRemainingIcon";
import { useCallback } from "react";

export function OutletCard({ id, bgImage, logoImage, name, walkTime, numBags }) {
    return (
        <Link to={"/outlet/" + id} className="rounded-2xl border-[1px] border-gray-200 border-solid overflow-hidden shadow-md">
        <div className="">
            {/* BG image */}
            <img
                className="w-full h-32 object-cover"
                src={bgImage} alt="Background of the outlet" />
        </div>

        <div className="p-4 flex flex-col gap-4">
            <div className="flex gap-4 items-center">

                {/* Vendor Logo */}
                <img
                    className="w-10 h-10 rounded-md object-cover"
                    src={logoImage}
                    alt="Logo of the outlet"
                />

                <div className="flex flex-col">
                    {/* Vendor name */}
                    <h3 className="text-xl font-semibold">{name}</h3>
                    {/* Vendor distance away */}
                    <p className="text-gray-400 text-sm">
                        <span>{walkTime}</span>
                        <span> min walk</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <BagsRemainingIcon quantity={numBags} />
            </div>
        </div>
    </Link>
    )
}