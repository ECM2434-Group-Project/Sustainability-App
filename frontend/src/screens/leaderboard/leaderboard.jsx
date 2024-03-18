import React from "react";
import {GoBackLink} from "../../components/General/GoBackLink";



export default function LeaderboardPage() {

    const [leaderboard, setLeaderboard] = React.useState([
        { first_name: "John", last_name: "Doe", "score": 100 },
        { first_name: "Jane", last_name: "Doe", "score": 90 },
        { first_name: "John", last_name: "Smith", "score": 80 },
        { first_name: "Jane", last_name: "Smith", "score": 70 },
        { first_name: "John", last_name: "Johnson", "score": 60 }
    ]);

    return (
        <section className="p-6 flex flex-col gap-6">

			<GoBackLink href={"/settings"} />

            <h1 className="text-2xl font-semibold">Leaderboard</h1>

            <div id="leaderboard">
                <table className="w-full row-sp text-gray-800">
                    <tbody>
                        {
                            leaderboard.map((user, i) => (
                                <tr key={i} className="flex items-center py-2">
                                    <td className="p-1 w-10">{i + 1}</td>
                                    <td className="p-1 w-12 flex justify-center">
                                        <div
                                            className="w-10 h-10 flex justify-center items-center rounded-full bg-exeterDeepGreen"
                                        >
                                            <span
                                                className="w-min h-min text-white font-semibold text-sm text-nowrap"
                                            >{user.first_name[0] + user.last_name[0]}</span>
                                        </div>
                                    </td>
                                    <td className="p-1 text-left" width={"100%"}>{user.first_name} {user.last_name}</td>
                                    <td className="p-1">
                                        <p className="text-md text-nowrap">
                                            {user.score} <small className="text-gray-600">XP</small>
                                        </p>
                                    </td>
                                </tr>
                            ))
                        }
                        {
                            // If you're not in the top 5
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
                                                >{"W"} {"W"}</span>
                                            </div>
                                        </td>
                                        <td className="p-1 text-left" width={"100%"}>
                                            <small className="text-gray-500">You</small>
                                            <br />
                                            {"Wiktor"} {"Wiejak"}
                                        </td>
                                        <td className="p-1">
                                            <p className="text-md text-nowrap">
                                                {420} <small className="text-gray-600">XP</small>
                                            </p>
                                        </td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )
}