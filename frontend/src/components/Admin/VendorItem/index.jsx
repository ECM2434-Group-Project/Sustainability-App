export function VendorItem({ vendor, setEditing }) {
	return (
		<div className="flex border rounded-3xl w-full box-content aspect-square hover:shadow-lg hover:border-black" onClick={() => {
			setEditing(vendor)
		}}>
			<img src={`http://127.0.0.1:8000/api/getvendorimage/${vendor.username}_icon.jpg`} alt={vendor.username} className="rounded-3xl" />
		</div>
	)
}