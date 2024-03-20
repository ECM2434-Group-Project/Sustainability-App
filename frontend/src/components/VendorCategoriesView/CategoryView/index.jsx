import { useCallback } from "react";
import { TbPaperBag, TbX } from "react-icons/tb";
import { client } from "../../../axios";
import { useUser } from "../../../contexts/userContext";


export function CategoryView({ deleteCategory, category, edit }) {

    const { refreshUser } = useUser()

    const addBag = useCallback(() => {
        // Create a bag for this category
        client.post("/api/vendors/bags/add", {
            "group_id": category.bag_group_id,
            "count": 1,
            "collection_time": new Date().toISOString()
        })
        .then(res => {
            refreshUser()
        })
        .catch(err => {
            console.error("Error creating bag", err)
        })
    }, [refreshUser])

    
    const removeBag = useCallback(() => {

        if(category?.bags_unclaimed === 0) return

        // Create a bag for this category
        client.post("/api/vendors/bags/remove", {
            "group_id": category.bag_group_id,
            "count": 1,
        })
        .then(res => {
            refreshUser()
        })
        .catch(err => {
            console.error("Error removing bag", err)
        })
    }, [refreshUser])


    return (
        <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">

                {
                    edit ? (
                        <button onClick={() => deleteCategory(category.bag_group_id)}>
                            <TbX />
                        </button>
                    ) : (
                        <></>
                    )
                }

                <div className="flex items-center gap-4">
                    <div className="text-red-700 text-5xl">
                        <TbPaperBag />
                    </div>
                    <h3>
                        {category?.name}
                    </h3>
                </div>

            </div>

            {
                !edit ? (
                    <div className="flex gap-2 items-center text-3xl">
                        <button onClick={removeBag}>-</button>
                        <div className="px-1 bg-gray-200 text-lg min-w-8 text-center rounded-md">{category?.bags_unclaimed}</div>
                        <button onClick={addBag}>+</button>
                    </div>
                ) : (
                    <div className="opacity-50 px-1 bg-gray-200 text-lg min-w-8 text-center rounded-md">{category?.bags_unclaimed}</div>
                )
            }

        </div>
    )
}