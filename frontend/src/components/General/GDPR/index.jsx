import React from 'react';
import { Link } from 'react-router-dom';

export default function GDPR() {
    return (
        <small>
            <span className="flex flex-row gap-3 justify-center"><Link className="flex underline" to={"/privacy-policy"}>Privacy Policy</Link>|<Link className="flex underline" to={"/terms-and-conditions"}>Terms and Conditions</Link></span>
        </small>
    )
}