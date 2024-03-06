import { TbPaperBag } from "react-icons/tb"
import { useUser } from "../../../contexts/userContext"
import { useEffect, useState } from "react"
import { client } from "../../../axios"
import { Link } from "react-router-dom"

export function UserClaimView() {

    const { user } = useUser()

    const [claims, setClaims] = useState([])
    const [error, setError] = useState()

    useEffect(() => {
        // Get the user's claims
        client.get("/api/claims")
        .then(res => setClaims(res.data))
        .catch(err => setError(true))

    },[])


    return !error ? (
        <section className="flex flex-col gap-4">
            {
                claims.map(d => {
                    d.time = new Date(d.time)
                    return d
                }
                ).sort((a,b) => b.time - a.time).map((c, index) => {
                    return (
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
            
                                        <h4>You have a bag waiting</h4>
            
                                        <p>You claimed this bag at {new Date(c.time).toLocaleTimeString()} on {new Date(c.time).toLocaleDateString()}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Link>
                    )
                })
            }
        </section>
    ) : (
        <p className="text-red-300">An error occurred</p>    
    )
}