import React from "react";
import { Link } from "react-router-dom";
import VendorMysteryBag from "../../components/VendorMysteryBag/VendorMysteryBag";

    // Based on state passed in which contains if logged in or not, display the home page with a login and register button

export default function Home() {
    
    const [loggedIn, setLoggedIn] = React.useState(true);

    if (!loggedIn)
    {
        return (
            <div>
            <h1>Home Page</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
            </div>
        );
    }
    if (loggedIn)
    {
        return (
            <div>
            <h1>Home Page</h1>
            <Link to="/logout">
                <button>Logout</button>
            </Link>

             {/* Display a list of vendor mystery bags */}
            <div>
                <VendorMysteryBag vendor="Marketplace" numBags={10} location="Location 1" />
                <VendorMysteryBag vendor="The Ram" numBags={20} location="Location 2" />
                <VendorMysteryBag vendor="ISCA Eats" numBags={30} location="Location 3" />
            </div>
            </div>
        );
    }
}