import { useCallback, useState } from "react"
import { useUser } from "../../../contexts/userContext"
import { client } from "../../../axios"

export function NewCategory({ setNewGroupOpen }) {

    const { refreshUser } = useUser()
    const [ name, setName ] = useState('')
    const [ allergenOptions, setAllergenOptions ] = useState({})

    const allergens = [ 'vegan', 'vegetarian', 'milk', 'eggs', 'fish', 'crustacean', 'tree_nuts', 'peanuts', 'wheat', 'soybeans', 'sesame' ]



    const makeNewCategory = useCallback(() => {

        // Create a new category
        client.post("/api/vendors/groups/add", {
            name: name,
            allergens: allergenOptions
        })
        .then(() => {
            setName('')
            refreshUser()
            setNewGroupOpen(false)
        })
        .catch(err => {
            console.error("Error creating group", err)
        })
    }, [name, refreshUser, allergenOptions, setNewGroupOpen])


    return (
        <div className="flex flex-col gap-4 justify-between">

            <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-2xl">New bag group</h2>

                <input placeholder="Eg. Vegetarian" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 py-3 border-[1px] border-solid border-gray-300 rounded-md" type="text" />

                <div className="flex flex-col gap-2">

                    <h4 className="font-medium">Allergy Information</h4>

                    {
                        allergens.map(a => {
                            return (
                                <label className="flex gap-2">

                                    <input
                                        type="checkbox"
                                        onChange={e => {
                                            setAllergenOptions(opts => {
                                                return {
                                                    ...opts,
                                                    [a]: e.target.checked
                                                }
                                            })
                                        }}
                                    />
                                    
                                    <span>{a.charAt(0).toUpperCase() + a.slice(1).split("_").join(" ")}</span>

                                </label>
                            )
                        })
                    }


                </div>
            </div>

            <button disabled={!name} className={name !== "" ? "bg-exeterDimRed text-sm text-white rounded-md p-4 text-nowrap" : "bg-gray-500 text-sm text-white rounded-md p-4 text-nowrap"} onClick={makeNewCategory}>Add</button>
        </div>   
    )
}