import React, { useEffect } from "react";
import {GoBackLink} from "../../components/General/GoBackLink";
import { useUser } from "../../contexts/userContext";
import { client } from "../../axios";


export default function LeaderboardPage() {

    useEffect(() => {
        client.get("/api/leaderboard").then((response) => {
            setLeaderboard(response.data);
        })
    }, []);

    const [leaderboard, setLeaderboard] = React.useState([]);

    return (
        <section className="p-6">
            <div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/settings"} />
			</div>
            <br></br>
            <h1>Leaderboard</h1>
        <div id="leaderboard">
            <div class="ribbon"></div>
            <table>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                {leaderboard.map((user, index) => (
                    <tr>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.score}</td>
                    </tr>
                ))}
            </table>
        </div>
        </section>
    )
}