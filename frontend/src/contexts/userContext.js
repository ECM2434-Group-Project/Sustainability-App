import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	useCallback
} from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

// setup axios to send cookies
axios.defaults.xsrfCookieName = "csrftoken"
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.withCredentials = true

// create an axios client
const client = axios.create({
	baseURL: "http://127.0.0.1:8000",
})


const UserContext = createContext({})

export const UserProvider = ({ children }) => {

	const [user, setUser] = useState({})
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

	return (
		<UserContext.Provider
			value={{ register, login, logout, user }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)