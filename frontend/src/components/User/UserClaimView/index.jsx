import { TbPaperBag } from "react-icons/tb"
import { useUser } from "../../../contexts/userContext"
import { useEffect, useState } from "react"
import { client } from "../../../axios"

export function UserClaimView() {

    const { user } = useUser()

    const [claims, setClaims] = useState([])
    const [error, setError] = useState()

    useEffect(() => {

        if(!user) return

        // Get the user's claims
        client.get("/api/claims")
        .then(res => setClaims(res.data))
        .catch(err => setError(true))

    }, [user])


    return !error ? (
        claims.map(c => {
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
    
                                <p>{c.expiration} Collect by this time</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    ) : (
        <p className="text-red-300">An error occurred</p>    
    )
}