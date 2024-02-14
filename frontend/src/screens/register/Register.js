import {React, useState} from "react";

export default function Register() {
// Create a register page that has a form with three fields, one for email, one for username, and one for password
// The form should have a submit button
// On submit, the form should make a POST request to /api/register at port 8000 with the email, username, and password in the request body
// If the request is HTTP_201_CREATED, the user should be redirected to the home page
// If the request is HTTP_400_BAD_REQUEST, the user should be shown an error message

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });
            const data = await response.json();
            if (response.status === 201) {
                console.log(data);
                console.log("Registered successfully");
                window.location.href = "/login";
            }
            else if (response.status === 400) {
                console.log(data);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}