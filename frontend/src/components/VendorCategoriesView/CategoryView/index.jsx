import { TbPaperBag } from "react-icons/tb";


export function CategoryView({ category }) {
    return (
        <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
                <div className="text-red-700 text-5xl">
                    <TbPaperBag />
                </div>
                <h3>
                    {category?.name}
                </h3>
            </div>

            <div className="flex gap-2 items-center text-2xl">
                <button>-</button>
                <div className="px-1 bg-gray-200 text-lg">0{category?.quantity}</div>
                <button>+</button>
            </div>

        </div>
    )
}