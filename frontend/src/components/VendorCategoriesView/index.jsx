import { CategoryView } from "./CategoryView"

export function VendorCategoriesView() {

    const categories = [
        {
            name: "Standard",
            colour: "black"
        },
        {
            name: "Vegitarian",
            colour: "black"
        },
        {
            name: "Vegan",
            colour: "black"
        },
        {
            name: "Gluten Free",
            colour: "black"
        }
    ]

    return (
        <div className="flex flex-col gap-6">
            {
                categories.map((c, i) => <CategoryView category={c} key={i} />)
            }
        </div>
    )
}