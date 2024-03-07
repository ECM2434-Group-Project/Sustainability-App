import { TbPaperBag } from "react-icons/tb";
import { UserClaimView } from "../../../components/User/UserClaimView";
import { useEffect, useState } from "react";


export function SpecificClaimView() {

    const [ claim, setClaim ] = useState()

    useEffect(() => {
        // Get the specific claim

        
    }, [])

    return (
        <section className="p-4">

            <div className="flex gap-4 overflow-x-auto text-white w-full p-2 bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen rounded-xl">
                <div className="bg-white p-[1.5px] rounded-xl flex-1 flex">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen flex-1 flex">
                        <div className="rounded-xl bg-cover bg-center flex flex-1 flex-col gap-4">

                            <div className="flex">
                                <h3 className="font-semibold text-6xl">
                                    <TbPaperBag />
                                </h3>
                            </div>

                            <h4>You have a bag waiting</h4>

                            <p>{c.expiration} Collect by this time</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}