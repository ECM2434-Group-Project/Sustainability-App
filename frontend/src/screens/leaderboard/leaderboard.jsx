import React, { useEffect } from "react";
import {GoBackLink} from "../../components/General/GoBackLink";
import { client } from "../../axios";
import { useSearchParams } from "react-router-dom";



export default function LeaderboardPage() {

    const [leaderboard, setLeaderboard] = React.useState([]);
    const [user, setUser] = React.useState({});
    const [userRank, setUserRank] = React.useState({});

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Get the leaderboard
        client.get("/api/leaderboard").then(res => {
            if (res.data.leaderboard.length > 10) {
                setUser(res.data.leaderboard[res.data.leaderboard.length - 1])
            }
            setLeaderboard(res.data.leaderboard.slice(0, 10))
            setUserRank(res.data.user_rank);
            console.log(res.data)
        }).catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <section className="p-6 flex flex-col gap-6">

			{/* <GoBackLink href={searchParams.get("ref") ? searchParams.get("ref") : "/settings"} /> */}
            <GoBackLink />

            <h1 className="text-2xl font-semibold">Leaderboard</h1>

            <div id="leaderboard">
                <table className="w-full row-sp text-gray-800">
                    <tbody>
                        {
                            leaderboard.map((row, i) => (
                                
                                <tr key={i} className="flex items-center py-2">
                                <td className="p-1 w-10">{i + 1}</td>
                                <td className="p-1 w-12 flex justify-center">
                                    <div
                                        className="w-10 h-10 flex justify-center items-center rounded-full bg-exeterDeepGreen"
                                    >
                                        <span
                                            className="w-min h-min text-white font-semibold text-sm text-nowrap"
                                        >{row.username[0]}</span>
                                    </div>
                                </td>
                                <td className="p-1 text-left" width={"100%"}>{row.username}</td>
                                <td className="p-1">
                                    <p className="text-md text-nowrap">
                                        {row.score} <small className="text-gray-600">XP</small>
                                    </p>
                                </td>
                            </tr>
                            ))
                        }
                        {user.username !== undefined ? (
                                    <>
                                    <tr className="py-4">
                                    <td colSpan={"100%"} className="text-center">....</td>
                                </tr>

                                <tr className="flex items-center py-2">
                                    <td className="p-1 w-10">{userRank}</td>
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
                                        {user.score} <small className="text-gray-600">XP</small>
                                    </p>
                                </td>
                                </tr>
                                    </>
                                 ) : (
                                    <></>
                               )
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )
}