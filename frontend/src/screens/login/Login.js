import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../../components/General/TextInput";

export default function Login() {
    // Create a login page that has a form with two fields, one for email and one for password
    // The form should have a submit button
    // On submit, the form should make a POST request to /api/login at port 8000 with the email and password in the request body
    // If the request is successful, the user should be redirected to the home page

    const nav = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [ error, setError ] = useState()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError(false)
        try {

            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                nav("/")
            } else {
                setError(true)
            }

        } catch (error) {
            // Login has failed
            setError(true)
            console.error(error);
        }
    }, [ error, email, password ])

    return (
        <div className="h-screen flex flex-col justify-center p-4 bg-exeterDeepGreen text-white gap-6">

            <form onSubmit={handleSubmit} className="flex flex-col gap-16">
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl font-bold">Login</h1>

                    <TextInput
                        label={"Your Exeter Email"}
                        className="rounded-md p-4 py-2 bg-white text-gray-950"
                        type="email"
                        placeholder="you@exeter.ac.uk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextInput
                        label={"Password"}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />



                </div>

                {
                    error ? (
                        <p className="p-4 text-center text-red-200">Incorrect email or password</p>
                    ) : (
                        <></>
                    )
                }

                <button
                    className="bg-exeterDarkGreen text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                    type="submit"
                >Login</button>
            </form>

            <div className="text-center">
                <small>
                    <Link to="/register">No Account? <span className="underline">create one</span></Link>
                </small>
            </div>


        </div>
    );
}