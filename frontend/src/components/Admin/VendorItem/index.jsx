export function VendorItem({ vendor, setEditing }) {
	return (
		<div className="relative flex border rounded-3xl w-full box-content aspect-square hover:shadow-lg hover:border-black" onClick={() => {
			setEditing(vendor)
		}}>
			<h2 className="absolute flex w-full justify-center">{vendor.first_name}</h2>
			<img src={vendor.icon} alt={vendor.username} className="rounded-3xl" />
		</div>
	)
}