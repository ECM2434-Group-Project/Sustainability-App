export function VendorItem({ vendor, setEditing }) {
	return (
		<div className="flex border rounded-3xl w-full box-content aspect-square hover:shadow-lg hover:border-black" onClick={() => {
			console.log("clicked")
			setEditing(vendor)
		}}>
			<img src={vendor.image} alt={vendor.username} className="rounded-3xl" />
		</div>
	)
}