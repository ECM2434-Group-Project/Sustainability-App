// This component is a card that contains the name of the vendor, the number of mystery bags and location

import React from "react";

export default function VendorMysteryBag({ vendor, numBags, location }) {
    return (
        <div style={{border: "1px solid black", borderRadius: "100px"}}>
            <h2>{vendor}</h2>
            <p>Number of Mystery Bags: {numBags}</p>
            <p>Location: {location}</p>
        </div>
    );
}
