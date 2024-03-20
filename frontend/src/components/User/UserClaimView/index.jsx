import { TbPaperBag } from "react-icons/tb"
import { useEffect, useState } from "react"
import { client } from "../../../axios"
import { Link } from "react-router-dom"

export function UserClaimView() {

    const [claims, setClaims] = useState([])
    const [error, setError] = useState()

    useEffect(() => {
        // Get the user's claims
        client.get("/api/claims")
        .then(res => {
            setClaims(res.data);
        })
        .catch(err => setError(true))

    },[])

    const calculateActive = () => {
        let counter = 0
        claims.forEach(c => {
            if (!c.success) {
                counter++
            }
        })
        return counter
    }

    return !error ? (
        <section className="flex flex-col gap-4">
            {
                // number of claims that have success false == 0
                calculateActive() ===  0 && (
                    <div className="text-red-300">You have no claims</div>
                )
            }
            {
                claims.map(d => {
                    d.time = new Date(d.time)
                    return d
                }
                ).sort((a,b) => b.time - a.time).map((c, index) => {
                    return !c.success ? (
                        <Link key={index} to={"/claim/"+c.claim_id}>
                            <div className="flex gap-4 overflow-x-auto text-white w-full p-2 bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen rounded-xl">
                                <div className="bg-white p-[1.5px] rounded-xl flex-1 flex">
                                    <div className="p-6 rounded-xl bg-gradient-to-r from-exeterDeepGreen to-exeterBrightGreen flex-1 flex">
                                        <div className="rounded-xl bg-cover bg-center flex flex-1 flex-col gap-4">
                
                                            <div className="flex">
                                                <h3 className="font-semibold text-6xl">
                                                    <TbPaperBag />
                                                </h3>
                                            </div>
                
                                            <h4>You have a {c.bag_group_name} bag waiting from {c.vendor_name}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <button key={index} className="cursor-default">
                            <div className="flex gap-4 overflow-x-auto text-white w-full p-2 bg-gray-400 rounded-xl">
                                <div className="bg-white p-[1.5px] rounded-xl flex-1 flex">
                                    <div className="p-6 rounded-xl bg-gray-500 flex-1 flex">
                                        <div className="rounded-xl bg-cover bg-center flex flex-1 flex-col gap-4">
                
                                            <div className="flex">
                                                <h3 className="font-semibold text-6xl">
                                                    <TbPaperBag />
                                                </h3>
                                            </div>
                
                                            <p> you have already claimed this bag from {c.vendor_name} on {new Date(c.time).toLocaleDateString()}</p>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })
            }
        </section>
    ) : (
        <p className="text-red-300">An error occurred</p>    
    )
}