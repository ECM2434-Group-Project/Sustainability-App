import { useCallback, useEffect, useState } from "react"
import { useUser } from "../../../../contexts/userContext"
import { client } from "../../../../axios"
import { Popup } from "../../../../components/General/Popup"
import { GoBackLink } from "../../../../components/General/GoBackLink"

export function VendorChangeName() {

    const { user } = useUser()
    const [ name, setName ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ confirm, setConfirm ] = useState(false)

    const [ done, setDone ] = useState(false)

    useEffect(() => {

        if(!user) return

        setName(user.first_name)

    }, [user])


    const changeName = useCallback(() => {

        setConfirm(false)

        client.post("/api/user/updateuser/", {
            password: password,
            first_name: user.first_name,
            new_first_name: name
        })
        .then(res => {
            console.log("RESPONDED", res)
            setDone(true)
        })
        .catch(err => {
            console.error(err)
            alert("Something went wrong")
        })
    })

    return !done ? (
        <>
            <section className="flex flex-col gap-6 p-4">

                <GoBackLink href="/vendor-admin/settings" />

                <h2 className="font-semibold">Change name</h2>

                <div>
                    <label>Vendor name</label>
                    <input className="p-3 w-full text-md border-[1px] border-solid border-gray-400 rounded-md" type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <button onClick={() => setConfirm(true)} className="w-full p-3 text-white rounded bg-gradient-to-r bg-exeterDimRed to-exeterBrightRed font-semibold text-lg">Change name</button>

            </section>

            <Popup trigger={confirm} setTrigger={setConfirm}>
                <div className="flex flex-col gap-4">
                    <h2 className="font-semibold">Please confirm your passoword to change your vendor name</h2>
                    <input placeholder="Enter password" className="p-3 text-md border-[1px] border-solid border-gray-400 rounded-md" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <div className="flex gap-3">
                    <button className="w-full p-3 text-white rounded bg-gray-500 font-semibold text-lg" onClick={() => setConfirm(false)}>Cancel</button>
                        <button className="w-full p-3 text-white rounded bg-gradient-to-r bg-exeterDimRed to-exeterBrightRed font-semibold text-lg" onClick={changeName}>Change name</button>
                    </div>
                </div>
            </Popup>
        </>
    ) : (
        <section className="flex flex-col gap-4 p-4">

            <GoBackLink href="/vendor-admin/settings" />

            <h2>Your name has been changed</h2>

        </section>
    )
}