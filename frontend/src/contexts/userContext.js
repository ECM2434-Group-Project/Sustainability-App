import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	useCallback
} from 'react'
import { client } from '../axios'



const UserContext = createContext({})

export const UserProvider = ({ children }) => {

	const [user, setUser] = useState()

	const register = useCallback(async (email, username, password, fName, lName) => {
		try {
			const res = await client.post("/api/register", {
				email: email,
				username: username,
				password: password,
				first_name: fName,
				last_name: lName,
			})
			
			if (res.status >= 200 && res.status < 300) {
				await login(email, password)
				await refreshUser()
				return true
			} else {
				return res.err
			}

		} catch (error) {
			console.error(error)
			return error
		}
		
	}, [])

	const login = useCallback(async (email, password) => {
		try {
			const res = await client.post("/api/login", {
				email: email,
				password: password,
			})
	
			if(res.status >= 200 && res.status < 300) {
				await refreshUser()
				return true
			} else if (res.status === 400) {
				alert("Invalid email or password");
				return false
			}
	
		} catch (error) {
			console.log(error);
			return error
		}
	}, [])

	const logout = useCallback(async () => {
		try {

			const res = await client.post("/api/logout")

			if(res.status >= 200 && res.status < 300) {
				setUser(null)
				return true
			}
        }
        catch (error) {
            console.error(error);
			return false
        }
	}, [])

	const setLocation = useCallback((longitude, latitude, accuracy) => {
		setUser((user) => {
			return {...user, longitude, latitude, accuracy}
		})
	}, [])

	// Fetches the user's data
	const refreshUser = useCallback(() => {
		return new Promise((res, rej) => {
			client.get("/api/user")
			.then(r => {
				// If the user is a vendor, get their vendor details
				if(r.data.user?.role === "VENDOR") {
					client.get("/api/vendors/" + r.data.user.id)
					.then(v => {
						setUser(v.data)
						res(true)
					})
					.catch(err => {
						console.error("Error getting user data", err)
						rej(err)
					})
				} else {
					// If user is not a vendor, return straight away
					setUser(r.data.user)
					res(true)
				}				
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
		.then(() => setTimeout(() => console.log("Got user", user), 100))
		.catch(() => setUser(null))
	}, [])
	

	return (
		<UserContext.Provider
			value={{ register, refreshUser, login, logout, setLocation, user}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)