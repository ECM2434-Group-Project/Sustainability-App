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
	const [locationVerified, setLocationVerified] = useState()
	const [location, setLocation] = useState(false)

	const refreshLocation = useCallback(() => {
		return user ? new Promise((res, rej) => {
			navigator.geolocation.getCurrentPosition((position) => {

				// grab the information
				const longitude = position.coords.longitude
				const latitude = position.coords.latitude
				const accuracy = position.coords.accuracy

				// set the state
				setLocation({longitude, latitude, accuracy})
				setLocationVerified(true)

				// return the promise
				res(true)

			}, (error) => {
				console.error(error)
				setLocationVerified(false)
				rej(error)
			})
		}) : (
			new Promise((res, rej) => {
				setLocationVerified(false)
				rej("User not logged in")
			})
		)
	}, [user])

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
	}, [refreshUser])

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
	
	// Get the user's data when the page loads
	useEffect(() => {

		// Get the user's data
		refreshUser()
		.then(() => setTimeout(() => console.log("Got user", user), 100))
		.catch(() => setUser(null))
	}, [])

	useEffect(() => {
		
		refreshLocation()
		.then(() => setTimeout(() => console.log("Got location", location), 100))
		.catch(() => setLocation(null))

	}, [user])
	

	return (
		<UserContext.Provider
			value={{ register, refreshUser, login, logout, refreshLocation, user, location, locationVerified}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)