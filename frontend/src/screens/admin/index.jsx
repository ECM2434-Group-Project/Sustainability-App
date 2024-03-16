import { useCallback, useEffect, useRef, useState } from "react";
import { UserAvatar } from "../../components/User/UserAvatar";
import { VendorItem } from "../../components/Admin/VendorItem";
import { Link, useNavigate } from "react-router-dom";
import { Popup } from "../../components/General/Popup";
import { useUser } from "../../contexts/userContext";
import { NotAdmin } from "../../components/Admin/NotAdmin";
import { client } from '../../axios'

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

	const [editing, setEditing] = useState(false)
	const [change, setChange] = useState(false)

	const editingName = useRef()
	const editingPassword = useRef()


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

	useEffect(() => {

		// ignore the first time
		if (!editing) {
			return
		}
		
		// set the ref to the value
		editingName.current.value = editing.username

		// set the change to false
		setChange(false)

	}, [editing])

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

	const updateVendor = (vendor) => {
		const username = editingName.current.value
		const password = editingPassword.current.value

		// check for no changes
		if (username === vendor.username && password === "") {
			return
		}


		console.log("updating the vendor")

		// update the vendor
		// client.put("/api/vendors/" + vendor.id, {
		// 	username: username,
		// 	password: password
		// }).then((response) => {
		// 	console.log(response)
		// }).catch((error) => {
		// 	console.log(error)
		// })


	}

	return user ? (
		<>
			{
				user.role === "ADMIN" ? (
					<section className="p-4 pl-36">
						<Popup trigger={editing} setTrigger={setEditing} size="large">
							<div className="bg-white p-4 rounded-lg flex flex-col">
								<text className="text-4xl font-extrabold">Edit Vendor</text>

								<text className="text-2xl font-bold mt-4">Vendor Name</text>
								<input type="text" ref={editingName} className="p-4 rounded-lg w-full border" onChange={(e) => {
									if (editing.username === e.target.value) {
										setChange(false)
									} else {
										setChange(true)
									}
								}}/>

								<text className="text-2xl font-bold mt-4">New Password</text>
								<input type="password" ref={editingPassword} className="p-4 rounded-lg w-full border" onChange={(e) => {
									setChange(true)
								}}/>
								
								{
									change ? (
										<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={() => {
											
											// update and close the popup
											updateVendor(editing)
											setEditing(false)
										}}>
											Save Changes
										</button>
									) : (
										<></>
									)
								}
								

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
		<>
			not logged in
		</>
	)
}