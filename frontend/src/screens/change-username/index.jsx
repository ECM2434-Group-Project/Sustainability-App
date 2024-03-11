import {React, useEffect, useState} from "react";
import { useCallback } from "react";
import { GoBackLink } from "../../components/General/GoBackLink";

export default function ChangeUsername() {

    const [username, setUsername] = useState("");

    const changeUsername = useCallback(() => {
        setUsername(document.getElementById("username").value);
    }, [setUsername]);

    useEffect(() => {
        // Axios call to change username
    }, [username])

  return (
    <section className="flex justify-center p-10">
        <div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/settings"} />
		</div>
      <div className="w-full">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-exeterBrightGreen hover:bg-exeterDeepGreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button" onClick={changeUsername}
            >
              Change Username
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
