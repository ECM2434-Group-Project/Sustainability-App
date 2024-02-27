import {React, useCallback, useState} from "react";
import { TextInput } from "../../components/General/TextInput";
import { useNavigate } from "react-router-dom";

export default function Register() {
// Create a register page that has a form with three fields, one for email, one for username, and one for password
// The form should have a submit button
// On submit, the form should make a POST request to /api/register at port 8000 with the email, username, and password in the request body
// If the request is HTTP_201_CREATED, the user should be redirected to the home page
// If the request is HTTP_400_BAD_REQUEST, the user should be shown an error message

    const nav = useNavigate()

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    const [ error, setError ] = useState()

    const [ stage, setStage ] = useState(0)

    const register = useCallback(async (e) => {
        e.preventDefault();
        setError(false)
        try {

            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, firstName: fName, lastName: lName, password }),
            });

            if (response.ok) {
                nav("/login")
            } else {
                console.error(await response.json())
                setError(true)
            }
            
        }
        catch (error) {
            setError(true)
            console.error(error);
        }
    }, [ email, username, fName, lName, password ])

    return (
        <div className="h-screen flex flex-col justify-center bg-exeterDeepGreen text-white gap-6">

            <form onSubmit={register} className="flex flex-col">
                <div className="flex flex-col gap-6">

                    <div className="p-4">
                        <h1 className="text-2xl font-bold">Register</h1>
                        <p>Stage {stage + 1} of 2</p>
                    </div>


                    <div className="flex overflow-x-hidden relative h-[50vh]">
                    <div className="flex flex-col gap-4 w-screen absolute left-0 p-4 transition-[1s]" style={{ transform: `translateX(${stage === 0 ? '0' : '100'}%)` }}>
                            <TextInput
                                label={"Exeter email"}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextInput
                                label={"Set a Username"}
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <TextInput
                                label={"Set a Password"}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            
                        </div>

                        <div className="flex flex-col gap-4 w-screen absolute left-0 p-4 transition-[1s]" style={{ transform: `translateX(${stage === 0 ? '100' : '0'}%)` }}>
                            <TextInput
                                label={"First Name"}
                                type="text"
                                placeholder="Edward"
                                value={fName}
                                onChange={(e) => setFName(e.target.value)}
                                required
                            />
                            <TextInput
                                label={"Last Name"}
                                type="text"
                                placeholder="Blewitt"
                                value={lName}
                                onChange={(e) => setLName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                </div>

                {
                    error ? (
                        <p className="p-4 text-center text-red-200">Something went wrong</p>
                    ) : (
                        <></>
                    )
                }

                <div className="p-4 flex flex-col gap-4">
                    {
                        stage === 1 ? (
                            <>
                                <button
                                    className="bg-exeterDarkGreen text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                                    onClick={() => setStage(1)}
                                >Create account</button>
                                <button
                                    className="bg-gray-600 text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                                    onClick={() => setStage(0)}
                                >Back</button>
                            </>
                        ) : (
                            <></>
                        )
                    }
                    {
                        stage === 0 ? (
                            <button
                                className="bg-exeterDarkGreen text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                                onClick={() => setStage(1)}
                            >Next</button>
                        ) : (
                            <></>
                        )
                    }
                </div>

            </form>
        </div>
    );
}