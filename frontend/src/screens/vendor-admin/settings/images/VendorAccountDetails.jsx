import { useCallback, useRef, useState } from "react";
import { TextInput } from "../../../../components/General/TextInput";
import { GoBackLink } from "../../../../components/General/GoBackLink";
import { client } from "../../../../axios";
import { useUser } from "../../../../contexts/userContext";
import { Popup } from "../../../../components/General/Popup_Mobile";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function VendorAccountImages() {

    const { user, refreshUser } = useUser()

    const [ name, setName ] = useState('')

    const [ changeLogoOpen, setChangeLogoOpen ] = useState(false)
    const [ changeBannerOpen, setChangeBannerOpen ] = useState(false)

    const logoInputRef = useRef()
    const bannerInputRef = useRef()

    const nav = useNavigate()


    const removeLogo = useCallback(async () => {
        console.log(user)
        await client.post("/api/deletevendorimage/" + user.username + "_icon.jpg")
        refreshUser()
    })

    const removeBanner = useCallback(async () => {
        console.log(user)
        await client.post("/api/deletevendorimage/" + user.username + "_banner.jpg")
        refreshUser()
    })

    const setLogo = useCallback(async () => {

        if(logoInputRef.current.files.length < 1) return

        var reader = new FileReader()
        var baseString


        reader.onloadend = async () => {

            baseString = reader.result

            await client.post("/api/uploadvendorimage/", {
                vendor_id: user.id,
                name: user.username,
                type: "icon",
                image: baseString
            })

            nav("/vendor-admin/")

        }

        reader.readAsDataURL(logoInputRef.current.files[0])

    })

    const setBanner = useCallback(async () => {

        if(bannerInputRef.current.files.length < 1) return

        var reader = new FileReader()
        var baseString


        reader.onloadend = async () => {

            baseString = reader.result

            await client.post("/api/uploadvendorimage/", {
                vendor_id: user.id,
                name: user.username,
                type: "banner",
                image: baseString
            })

            nav("/vendor-admin/")
        }

        reader.readAsDataURL(bannerInputRef.current.files[0])

    })



    return (
        <>
            <section className="flex flex-col gap-8 h-screen">

                <div className="p-4">
                    <GoBackLink href={"/vendor-admin/settings"} />
                </div>

                {/* Change logo */}
                <div className="text-center flex flex-col gap-2">
                    <img
                        className="w-32 h-32 object-cover borer-[1px] border-solid border-gray-300 rounded-md m-auto"
                        src={"http://127.0.0.1:8000" + user?.icon}
                        alt={user?.first_name + " Icon"}
                    />
                    <div className="flex gap-2 justify-center">
                        <button className="p-1 px-2 bg-exeterDimRed text-white rounded" onClick={() => setChangeLogoOpen(true)}>Change logo</button>
                        <button className="p-1 px-2 bg-gray-200 border-solid border-[1px] border-gray-400 text-gray-500 rounded" onClick={removeLogo}>Remove logo</button>
                    </div>
                </div>


                <div className="flex flex-col gap-8 bg-gray-100 p-4 pt-8 flex-1">

                    {/* Change background image */}
                    <div className="flex flex-col gap-2">
                        <img
                            className="w-full h-32 object-cover borer-[1px] border-solid border-gray-300 rounded-md"
                            src={"http://127.0.0.1:8000" + user?.banner}
                            alt={user?.first_name + " Banner"}
                        />
                        <div className="flex gap-2">
                            <button className="p-1 px-2 bg-exeterDimRed text-white rounded" onClick={() => setChangeBannerOpen(true)}>Change Banner</button>
                            <button className="p-1 px-2 bg-gray-200 border-solid border-[1px] border-gray-400 text-gray-500 rounded" onClick={removeBanner}>Remove banner</button>
                        </div>
                    </div>

                </div>
            </section>

            <Popup trigger={changeLogoOpen} setTrigger={setChangeLogoOpen}>
                <div className="flex flex-col gap-6 items-center text-center">

                    <h2 className="font-semibold text-xl">Change Logo</h2>

                    <input ref={logoInputRef} type="file" accept="*/image" />

                    <button onClick={setLogo} className="w-full p-3 text-white rounded bg-gradient-to-r bg-exeterDimRed to-exeterBrightRed font-semibold text-lg">Save</button>

                </div>
            </Popup> 

            
            <Popup trigger={changeBannerOpen} setTrigger={setChangeBannerOpen}>
                <div className="flex flex-col gap-6 items-center text-center">

                    <h2 className="font-semibold text-xl">Change Banner Image</h2>

                    <input ref={bannerInputRef} type="file" accept="*/image" />

                    <button onClick={setBanner} className="w-full p-3 text-white rounded bg-gradient-to-r bg-exeterDimRed to-exeterBrightRed font-semibold text-lg">Save</button>

                </div>
            </Popup> 
        
        
        </>
    )
}