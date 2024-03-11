export function VendorItem({ vendor }) {
	return (
		<div className="flex border rounded-3xl w-full box-content aspect-square hover:shadow-lg hover:border-black">
			<img src={vendor.image} alt={vendor.name} className="rounded-3xl" />
			{/* <p>VendorItem</p> */}

		</div>
	)
}