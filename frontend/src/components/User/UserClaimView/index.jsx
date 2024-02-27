import { TbPaperBag } from "react-icons/tb"

export function UserClaimView() {

    // Not sure what format this data will take, but I have assumed this for now - Ed
    const claim = {
            outletName: "The Ram Bar",
            expiration: new Date().getTime() + 1000 * 60 * 15   // Expiration in 15 mins??
        }

    return (
        <div className="flex gap-4 overflow-x-auto text-white w-full p-2 bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen rounded-xl">
            <div className="bg-white p-[1.5px] rounded-xl">
                <div className="p-6 rounded-xl bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen">
                    <div className="rounded-xl bg-cover bg-center flex flex-col gap-4">

                        <div className="flex">
                            <h3 className="font-semibold text-6xl">
                                <TbPaperBag />
                            </h3>
                        </div>

                        <h4>You have a bag waiting</h4>

                        <p>{claim.expiration} Collect by this time</p>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}