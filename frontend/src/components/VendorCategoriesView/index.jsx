import { HiPlus, HiX } from "react-icons/hi"
import { CategoryView } from "./CategoryView"
import { useCallback, useEffect, useRef, useState } from "react"
import { TbEdit, TbX } from "react-icons/tb"
import { client } from "../../axios"
import { useUser } from "../../contexts/userContext"
import { Popup } from "../General/Popup"
import { NewCategory } from "./NewCategory"

export function VendorCategoriesView() {

    const [ edit, setEdit ] = useState(false)
    const [ newGroupOpen, setNewGroupOpen ] = useState(false)

    const { refreshUser, user } = useUser()


    const deleteCategory = useCallback((group_id) => {
        // Create a new category
        client.post("/api/vendors/groups/remove", {
            group_id: group_id
        })
        .then(() => {
            refreshUser()
        })
        .catch(err => {
            console.error("Error removing group", err)
        })
    }, [refreshUser])



    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5">
                {
                    user?.bag_groups.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No categories</p>
                    ) : (
                        <></>
                    )
                }
                {
                    user?.bag_groups.map((c, i) => <CategoryView deleteCategory={deleteCategory} edit={edit} category={c} key={i} />)
                }

                {
                    edit ? (
                        <Popup trigger={newGroupOpen} setTrigger={setNewGroupOpen}>
                            <NewCategory setNewGroupOpen={setNewGroupOpen} />
                        </Popup>
                    ) : (
                        <></>
                    )
                }

            </div>

            <div className="flex flex-col gap-2">
                {
                    edit ? (
                        <button className="border-solid border-[0.8px] bg-exeterDimRed text-white font-semibold rounded-md flex gap-2 items-center p-4 py-2 w-fit justify-center text-center font-normal" onClick={() => setNewGroupOpen(true)}>
                            <HiPlus />
                            <span>New Category</span>
                        </button>
                    ) : (
                        <></>
                    )
                }
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