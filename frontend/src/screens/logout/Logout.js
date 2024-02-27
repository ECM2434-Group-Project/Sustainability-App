import React from "react";

export default function Logout() {
    // Create a logout page that has a button to logout
    // On click, the button should make a POST request to /api/logout at port 8000
    // If the request is successful, the user should be redirected to the home page
    const handleLogout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
            });
            if (response.ok) {
                console.log("Logged out successfully");
                window.location.href = "/";
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <h1>Logout Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}