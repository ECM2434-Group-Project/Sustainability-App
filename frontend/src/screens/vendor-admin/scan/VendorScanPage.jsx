import { useState } from "react";
import useDigitInput from "react-digit-input";
import { GoBackLink } from "../../../components/General/GoBackLink";

export function VendorScanPage() {

    const [ code, setCode ] = useState('')


    return (
        <section className="p-4 flex flex-col gap-6 h-screen justify-between">

            <div>
                <GoBackLink href={"/vendor-admin"} />
            </div>


            <h1 className="text-4xl font-semibold">Scan a code</h1>

            <input className="text-2xl p-2 bg-gray-200" placeholder="X X X X" type="text" onChange={e => setCode(e.target.value)} value={code} />

            <button
                className="bg-exeterDimRed to-exeterBrightRed text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
            >Check code</button>
            
        </section>
    )
}