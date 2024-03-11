import React from "react";
import {GoBackLink} from "../../components/General/GoBackLink";

export default function LeaderboardPage() {

    const [leaderboard, setLeaderboard] = React.useState([
        {"name": "John Doe", "score": 100},
        {"name": "Jane Doe", "score": 90},
        {"name": "John Smith", "score": 80},
        {"name": "Jane Smith", "score": 70},
        {"name": "John Johnson", "score": 60},
        {"name": "Jane Johnson", "score": 50},
        {"name": "John Brown", "score": 40},
        {"name": "Jane Brown", "score": 30},
        {"name": "John White", "score": 20},
        {"name": "Jane White", "score": 10},
    ]);

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
                    <td>{user.name}</td>
                    <td>{user.score}</td>
                    </tr>
                ))}
            </table>
        </div>
        </section>
    )
}