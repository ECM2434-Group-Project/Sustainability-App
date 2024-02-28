import React from "react";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {

    const { logout } = useUser()

    const nav = useNavigate()

    // Create a logout page that has a button to logout
    // On click, the button should make a POST request to /api/logout at port 8000
    // If the request is successful, the user should be redirected to the home page

    return (
        <div>
            <h1>Logout Page</h1>
            <button onClick={() => {
                logout()
                nav("/login")
            }}>Logout</button>
        </div>
    );
}