import { HiPlus, HiX } from "react-icons/hi"
import { CategoryView } from "./CategoryView"
import { useCallback, useRef, useState } from "react"
import { TbEdit, TbX } from "react-icons/tb"
import { client } from "../../axios"

export function VendorCategoriesView() {

    const getCategories = useCallback(() => {
        client.get("/api/")
    }, [])

    const nameRef = useRef()

    const [ open, setOpen ] = useState(false)
    const [ edit, setEdit ] = useState(false)

    const makeNewCategory = useCallback(() => {
        console.log("Creating", nameRef.current.value)


        // Create a new category


        nameRef.current.value = ""
    })

    const categories = [
        {
            name: "Standard",
            colour: "black"
        },
        {
            name: "Vegitarian",
            colour: "black"
        }
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5">
                {
                    categories.map((c, i) => <CategoryView edit={edit} category={c} key={i} />)
                }

                {
                    edit ? (
                        <div className="flex gap-2">
                            <input placeholder="Eg. Vegitarian" ref={nameRef} className="w-full p-2 py-3 border-[1px] border-solid border-gray-300 rounded-md" type="text" />
                            <button className=" bg-gray-500 text-sm text-white rounded-md p-2 px-3 text-nowrap" onClick={makeNewCategory}>Add</button>
                        </div>
                    ) : (
                        <></>
                    )
                }

            </div>

            <div className="flex gap-2">
                <button className="border-solid border-[0.8px] border-gray-200 rounded-md flex gap-2 items-center text-gray-500 p-4 w-fit justify-center text-center font-normal" onClick={() => setEdit(e => !e)}>
                    {
                        !edit ? (
                            <TbEdit />
                        ) : (
                            <>
                                <TbX />
                                <span>Stop editing</span>
                            </>
                        )
                    }
                </button>
            </div>
        </div>
    )
}