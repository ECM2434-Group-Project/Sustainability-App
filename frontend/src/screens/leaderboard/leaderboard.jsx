import React, { useEffect } from "react";
import {GoBackLink} from "../../components/General/GoBackLink";
import { client } from "../../axios";
import { useUser } from "../../contexts/userContext";



export default function LeaderboardPage() {

    const [leaderboard, setLeaderboard] = React.useState([]);
    const [isTop5, setIsTop5] = React.useState(false);

<<<<<<< HEAD
    const userContext = useUser();

    useEffect(() => {
        // Get the leaderboard
        client.get("/api/leaderboard").then(res => {
            setLeaderboard(res.data.leaderboard)
            console.log(userContext.user);
            if (!userContext.user) {
                return;
            }
            if (res.data.leaderboard.filter(user => user.username === userContext?.user.username).length > 0) {
                setIsTop5(true)
            }
        })
    }, [])

    return userContext ? (
        <section className="p-6 flex flex-col gap-6">

			<GoBackLink href={"/settings"} />

            <h1 className="text-2xl font-semibold">Leaderboard</h1>

            <div id="leaderboard">
                <table className="w-full row-sp text-gray-800">
                    <tbody>
                        {
                            leaderboard.map((user, i) => (
                               i < 5 ? (
                                <tr key={i} className="flex items-center py-2">
                                <td className="p-1 w-10">{i + 1}</td>
                                <td className="p-1 w-12 flex justify-center">
                                    <div
                                        className="w-10 h-10 flex justify-center items-center rounded-full bg-exeterDeepGreen"
                                    >
                                        <span
                                            className="w-min h-min text-white font-semibold text-sm text-nowrap"
                                        >{user.username[0]}</span>
                                    </div>
                                </td>
                                <td className="p-1 text-left" width={"100%"}>{user.username}</td>
                                <td className="p-1">
                                    <p className="text-md text-nowrap">
                                        {user.score} <small className="text-gray-600">XP</small>
                                    </p>
                                </td>
                            </tr>
                               ) : (
                                <>
                                <tr className="py-4">
                                    <td colSpan={"100%"} className="text-center">....</td>
                                </tr>

                                <tr className="flex items-center py-2">
                                    <td className="p-1 w-10">{42}</td>
                                        <td className="p-1 w-12 flex justify-center">
                                            <div
                                                className="w-10 h-10 flex justify-center items-center bg-exeterBrightRed rounded-full"
                                            >
                                                <span
                                                    className="w-min h-min text-white font-semibold text-sm text-nowrap"
                                                >{user.username[0]}</span>
                                            </div>
                                        </td>
                                        <td className="p-1 text-left" width={"100%"}>
                                            <small className="text-gray-500">You</small>
                                            <br />
                                            {user.username}
                                        </td>
                                        <td className="p-1">
                                            <p className="text-md text-nowrap">
                                                {leaderboard.user_rank} <small className="text-gray-600">XP</small>
                                            </p>
                                        </td>
                                </tr>
                                </>
                               )
                            ))
                        }
                        {
                            // If you're not in the top 5
                            <>
                                
                            </>
                        }
                    </tbody>
                </table>
            </div>
=======
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
>>>>>>> ef1b201 (Rebase frontend onto main)
        </section>
    ) : (
        <></>
    )
}