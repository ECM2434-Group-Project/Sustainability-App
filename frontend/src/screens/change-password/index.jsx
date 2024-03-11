import {React, useEffect, useState} from "react";
import { useCallback } from "react";
import { GoBackLink } from "../../components/General/GoBackLink";

export default function ChangePassword() {

    const [password, setPassword] = useState("");

    const changePassword = useCallback(() => {
        const inputPassword = (document.getElementById("password").value);
        const inputConfirmPassword = (document.getElementById("confirmPassword").value);

        if (inputPassword !== inputConfirmPassword) {
            alert("Passwords do not match");
        } else {
            setPassword(inputPassword);
        }
    }, [setPassword]);



    useEffect(() => {
        // Axios call to change password
    }, [password])

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
              for="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-exeterBrightGreen hover:bg-exeterDeepGreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button" onClick={changePassword}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
