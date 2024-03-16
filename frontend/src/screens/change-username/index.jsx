import {React, useEffect, useState} from "react";
import { useCallback } from "react";
import { GoBackLink } from "../../components/General/GoBackLink";
import { useUser } from "../../contexts/userContext";
import { client } from "../../axios";

export default function ChangeUsername() {

  const user = useUser();

    const changeUsername = useCallback(() => {
        if (document.getElementById("username").value === "") {
            alert("Username cannot be empty");
            return;
        }

        if (document.getElementById("oldUsername").value === document.getElementById("username").value) {
            alert("New username cannot be the same as the old username");
            return;
        }
        
        client.post("/api/user/updateuser", {
            username: document.getElementById("oldUsername").value,
            password: document.getElementById("password").value,
            new_username: document.getElementById("username").value,
        }).then((response) => {
            if (response.status === 200) {
                alert("Username changed successfully");
            } else {
                alert("Error changing username");
            }
        }
        ).catch((error) => {
            alert("Error changing username");
        });
        }, []);

  return (
    <section className="flex justify-center p-10">
        <div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/settings"} />
		</div>
      <div className="w-full">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldUsername">
              Old Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="oldUsername"
              type="text"
              placeholder="Old Username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
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
