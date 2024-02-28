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

	const nav = useNavigate()


	const register = useCallback(async (email, password) => {
		console.log("registering user")

		// TODO
	}, [])

	const login = useCallback(async (email, password) => {
		console.log("logging in user")

		client.post("/api/login", {
			email: email,
			password: password,
		}).then((response) => {
			console.log(response.data)
			nav("/")
		})
		.catch((error) => {
			return error
		})
	}, [])

	const logout = useCallback(() => {
		console.log("logging out user")
	}, [])

	const verifyLocation = useCallback(() => {
		console.log("verifying location")
	}, [])

	// Fetches the user's data
	const refreshUser = useCallback(() => {
		client.get("/api/login")
		.then(res => setUser(res))
		.catch(err => console.error("Error getting user data", err))
	}, [])
	
	// Get the user's data when the page loads
	useEffect(() => refreshUser, [])

	

	return (
		<UserContext.Provider
			value={{ register, refreshUser, login, logout, user, locationVerified }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)