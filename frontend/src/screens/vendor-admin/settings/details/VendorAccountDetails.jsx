import { useState } from "react";
import { TextInput } from "../../../../components/General/TextInput";
import { GoBackLink } from "../../../../components/General/GoBackLink";

export function VendorAccountDetails() {

    const [ name, setName ] = useState('')

    return (
        <section className="flex flex-col gap-8">

            <div className="p-4">
                <GoBackLink href={"/vendor-admin/settings"} />
            </div>

            {/* Change logo */}
            <div className="text-center">
                <img
                    className="w-32 h-32 object-cover borer-[1px] border-solid border-gray-300 rounded-md m-auto"
                    src="https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"
                />
                <p>Change logo</p>
            </div>


            <div className="flex flex-col gap-8 bg-gray-100 p-4 pt-8">

                {/* Change background image */}
                <div>
                    <img
                        className="w-full h-32 object-cover borer-[1px] border-solid border-gray-300 rounded-md"
                        src="https://liveevents.exeter.ac.uk/wp-content/uploads/2022/02/Section-1.png"
                    />
                    <p>Change image</p>
                </div>

                <div>
                    <label>Vendor name</label>
                    <TextInput value={name} onChange={e => setName(e.target.value)} />
                </div>

            </div>
        </section>
    )
}