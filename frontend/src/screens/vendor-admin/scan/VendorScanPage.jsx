import { useCallback, useState } from "react";
import { GoBackLink } from "../../../components/General/GoBackLink";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti"
import { client } from "../../../axios";
import { QrReader } from 'react-qr-reader';

export function VendorScanPage() {

    const [ code, setCode ] = useState('')
    const [ outcome, setOutcome ] = useState()

    const [ checking, setChecking ] = useState(false)

    const checkCode = useCallback((claim_id, user_id) => {
        console.log(claim_id)
        console.log(user_id)

        setChecking(true)
        client.post("/api/vendors/claimclaim", {
            claim_id: claim_id,
            user_id: user_id
        })
        .then(res => {
            console.log("CLAIM RETURNED", res)

            if (res.data.message === "Claim already claimed") {
                setOutcome("Claim already claimed");
                setTimeout(() => setOutcome(null), 2000)
                setCode('')
            }

            setOutcome("yes")
            setTimeout(() => setOutcome(null), 2000)
            setCode('')
            setChecking(false)
        })
        .catch(err => { 
            console.error("Error scanning claim", err)
            setOutcome(err.response.data.message)
            setTimeout(() => setOutcome(null), 2000)
            setCode('')
            setChecking(false)
        })
    }, [code, checking])


    return (
        <section className="p-4 flex flex-col gap-6 h-screen justify-between">

            <div>
                <GoBackLink href={"/vendor-admin"} />
            </div>

            {
                !outcome ? (
                    <>
                        <div className="flex flex-col gap-2 flex-1">
                            <h1 className="text-4xl font-semibold">Scan a code</h1>

                            <div className="border-dashed border-[2px] border-gray-500 p-4 bg-gray-200">
                                <QrReader
                                    constraints={{facingMode:"environment"}}
                                    onResult={(result, error) => {

                                        // only scan if there is something cool in the result
                                        if (result) {
                                            const obj = JSON.parse(result.text)
                                            checkCode(obj.claim_id, obj.user_id)
                                        }
                                    }}
                                />
                            </div>

                            <div className="text-center py-2">
                                <small>Or</small>
                            </div>

                            <input className="text-2xl p-2 bg-gray-200 w-full" placeholder="Type code" type="text" onChange={e => setCode(e.target.value)} value={code} />
                        </div>

                        <button
                            disabled={code === ""}
                            onClick={checkCode}
                            className={
                                code ? (
                                    "bg-exeterDimRed to-exeterBrightRed text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                                ) : (
                                    "bg-gray-400 to-gray-200 text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                                )
                            }
                        >Check code</button>
                    </>
                ) : (
                    outcome === "yes" ? (
                        <div className="flex-1 flex justify-center items-center left-0 top-0 fixed w-screen h-screen z-20 text-center gap-4 bg-exeterDeepGreen text-white">
                            <span className="text-6xl">
                                <TiTick />
                            </span>
                            <p>Claim OK</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-center items-center left-0 top-0 fixed w-screen h-screen z-20 text-center gap-4 bg-exeterDimRed text-white">
                            <span className="text-6xl">
                                <ImCross />
                            </span>
                            <p>{outcome}</p>
                        </div>
                    )
                )
            }
            
        </section>
    )
}