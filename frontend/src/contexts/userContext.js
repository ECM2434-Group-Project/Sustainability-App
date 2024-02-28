import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	useCallback
} from 'react'
import { useNavigate } from "react-router-dom"
import { client } from '../axios'



const UserContext = createContext({})

export const UserProvider = ({ children }) => {

	const [user, setUser] = useState()
	const [locationVerified, setLocationVerified] = useState(false)

	const register = useCallback(async (email, password) => {
		console.log("registering user")

		// TODO
	}, [])

	const login = useCallback(async (email, password) => {

		const res = await client.post("/api/login", {
			email: email,
			password: password,
		})

		if(res.status >= 200 && res.status < 300) {
			await refreshUser()
			return true
		}

	}, [])

	const logout = useCallback(async () => {
		try {

			const res = await client.post("/api/logout")

			if(res.status >= 200 && res.status < 300) {
				await refreshUser()
				return true
			}
        }
        catch (error) {
            console.error(error);
			return false
        }
	}, [])

	const verifyLocation = useCallback(() => {
		console.log("verifying location")
	}, [])

	// Fetches the user's data
	const refreshUser = useCallback(() => {
		return new Promise((res, rej) => {
			client.get("/api/user")
			.then(r => {
				console.log(r.data.user)
				setUser(r.data.user)
				res(true)
			})
			.catch(err => {
				console.error("Error getting user data", err)
				rej(err)

			})
		})
	}, [])
	
	// Get the user's data when the page loads
	useEffect(() => {
		refreshUser()
		.then(() => console.log("Got user"))
		.catch(() => setUser(null))
	}, [])

	useEffect(() => {
		console.log(user)
	}, [user])

	

	return (
		<UserContext.Provider
			value={{ register, refreshUser, login, logout, user, locationVerified }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)