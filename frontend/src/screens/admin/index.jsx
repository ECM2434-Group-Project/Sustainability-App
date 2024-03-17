import { useCallback, useEffect, useRef, useState } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { VendorItem } from "../../components/Admin/VendorItem";
import { Link, useNavigate } from "react-router-dom";
import { Popup } from "../../components/General/Popup";
import { useUser } from "../../contexts/userContext";
import { NotAdmin } from "../../components/Admin/NotAdmin";
import { client } from '../../axios'
import { NotLoggedIn } from "../../components/General/NotLoggedIn";

export default function AdminPage() {

	const [vendors, setVendors] = useState([])

	const [editing, setEditing] = useState(false)

	const nav = useNavigate()

	const { user } = useUser()

	// when the user changes, fetch vendor information and set it
	useEffect(() => {

		// fetch the vendors
		client.get("/api/vendors").then((response) => {
			const data = response.data
			console.log(data)
			setVendors(data)
		}).catch((error) => {
			console.log(error)
			setVendors([])
		})
	}, [user])

	/**
	 * a function for deleting a vendor
	 * 
	 * @param {*} vendor the vendor to delete
	 */
	const deleteVendor = (vendor) => {
		console.log("delting vendor " + vendor)

		// remove this vendor from the vendors
		setVendors(vendors.filter((v) => v !== vendor))
	}

	return user ? (
		<>
			{
				user.role === "ADMIN" ? (
					<section className="p-4 pl-36">
						<Popup trigger={editing} setTrigger={setEditing} size="large">
							<div className="bg-white p-4 rounded-lg flex flex-col">

								<h1 className="text-4xl font-bold">{editing.username}</h1>
								<img src={`http://127.0.0.1:8000/api/getvendorimage/${editing.username}_banner.jpg`} alt={editing.username} className="rounded-3xl" />
								<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={() => {

									// delete the vendor and close the popup
									deleteVendor(editing)
									setEditing(false)
								}}>
									Delete Vendor
								</button>
							</div>
						</Popup>

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
										<VendorItem key={index} vendor={vendor} setEditing={setEditing} />
									)
								})
							}
						</div>


					</section>
				) : (
					<NotAdmin />
				)
			}
		</>

	) : (
		<NotLoggedIn />
	)
}