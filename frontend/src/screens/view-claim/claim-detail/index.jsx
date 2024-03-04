import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../../axios";
import { useNavigate } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";
import {QRCodeSVG} from 'qrcode.react';

export function ClaimDetailPage() {

	const { claim } = useParams();

    const nav = useNavigate();

    const [claimData, setClaimData] = useState({});

    // FETCH THIS CLAIM'S INFO
    useEffect(() => {
        client.get("/api/claims").then((response) => {
            for (const c of response.data) {
                if (c.claim_id === parseInt(claim)) {
                    setClaimData(c);
                    return;
                }
            }
        });
    }, []);

	if (claimData.claim_id === undefined) {
        return (
            <div className="flex flex-col items-center pt-20">
                <div className="absolute top-2 left-2 z-10">
                    <GoBackLink href={"/view-claim"} />
                </div>
                <h1 className="text-2xl font-semibold">Claim</h1>
                <p>Claim not found</p>
            </div>
        );

    } else {
        return (
            <div className="flex flex-col items-center pt-20 p-4">
                 <div className="absolute top-2 left-2 z-10">
                    <GoBackLink href={"/view-claim"} />
                </div>

                <h1 className="text-2xl font-semibold">Your claim {claimData.claim_id}</h1>

                <p className="text-gray-600">{new Date(claimData.time).toLocaleTimeString()} on {new Date(claimData.time).toLocaleDateString()}</p>

                <div className="p-8">
                    <QRCodeSVG value={`claim-${claimData.claim_id}`}/>,
                </div>

            </div>
        );
    }
}
