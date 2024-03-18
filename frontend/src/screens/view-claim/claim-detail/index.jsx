import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../../axios";
import { useNavigate } from "react-router-dom";
import { GoBackLink } from "../../../components/General/GoBackLink";
import {QRCodeSVG} from 'qrcode.react';
import {useUser} from "../../../contexts/userContext";


export function ClaimDetailPage() {

	const { claim } = useParams();

    const nav = useNavigate();

    const { user } = useUser();

    const [claimData, setClaimData] = useState({});
    const [bagData, setBagData] = useState({});
    const [bagGroupData, setBagGroupData] = useState({});

    // FETCH THIS CLAIM'S INFO
    useEffect(() => {
        client.get("/api/claims").then((response) => {
            for (const c of response.data) {
                if (c.claim_id === parseInt(claim)) {
                    setClaimData(c);
                    client.get("/api/bags").then((response) => {
                        for (let i = 0; i < response.data.length; i++) {
                            if (response.data[i].bag_id === c.bag) {
                                setBagData(response.data[i]);
                                return;
                            }
                        }
                    });
                    return;
                }
            }
        });
    }, []);

    // useEffect(() => {
        


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

                <h1 className="text-2xl font-semibold">Your claim</h1>

                <p className="text-gray-600">{new Date(claimData.time).toLocaleTimeString()} on {new Date(claimData.time).toLocaleDateString()}</p>

                <div className="p-8">
                    <QRCodeSVG value={JSON.stringify({
                        claim_id: claimData.claim_id,
                        user_id: user.id,
                    })}/>,
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Bag details</h2>
                    <p>Collect your bag at {new Date(bagData.collection_time).toLocaleTimeString()} on {new Date(bagData.collection_time).toLocaleDateString()}</p>
                    </div>
            </div>
        );
    }
}
