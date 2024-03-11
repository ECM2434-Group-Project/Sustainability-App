import { useCallback, useState } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { VendorItem } from "../../components/Admin/VendorItem";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPage() {

	const [vendors, setVendors] = useState([
		{
			name: "vendor1",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor2",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor3",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor4",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor5",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor6",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor7",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor8",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor9",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor10",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor11",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor12",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor13",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor14",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor15",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor16",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor17",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor18",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor19",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor20",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor21",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor22",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor23",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor24",
			image: "https://via.placeholder.com/150"
		},
		{
			name: "vendor25",
			image: "https://via.placeholder.com/150"
		},
	])

	const [creating, setCreating] = useState(false)


	const nav = useNavigate()

	return(
		<section className="p-4 pl-36">
			<div className="flex justify-between sticky top-0 bg-white pb-2 pt-2">
				<div className="flex justify-between w-full pr-36">
					<h1 className="font-extrabold text-4xl p-2 b-0 m-0">Welcome Admin</h1>
					<button className="bg-exeterBlue pl-6 pr-6 pt-4 pb-4 rounded-lg" onClick={() => {
						nav("/admin/create-vendor")
					}}>
						Create Vendor
					</button>
				</div>
				

				<UserAvatar />
			</div>

			<div className="sticky top-10">
				
			</div>

			<div className="grid grid-cols-4 gap-20 pt-8 pr-48">
				{
					vendors.map((vendor, index) => {
						return (
							<VendorItem key={index} vendor={vendor} />
						)
					})
				}
			</div>

			
		</section>
	)
}