import {React, useEffect, useState} from "react";
import { useCallback } from "react";
import { GoBackLink } from "../../components/General/GoBackLink";
import { client } from "../../axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const nav = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");

    const changePassword = useCallback(() => {
        if (newPassword !== newConfirmPassword) {
            alert("Passwords do not match");
        } else if (oldPassword === newPassword) {
            alert("New password cannot be the same as old password");
        } else if (newPassword === "") {
            alert("Password cannot be empty");
        } else {
            client.post("/api/user/updateuser", {
                password: oldPassword,
                new_password: newPassword,
            }).then((response) => {
                if (response.status === 200) {
                    alert("Password changed successfully");
                    nav("/login");
                } else {
                    alert("Error changing password");
                }
            }
            ).catch((error) => {
                alert("Error changing password");
            });
        }
    }, [oldPassword, newPassword, newConfirmPassword]);

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
              for="oldPassword"
            >
              Old Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="oldPassword"
              type="password"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
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
              onChange={(e) => setNewPassword(e.target.value)}
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
              onChange={(e) => setNewConfirmPassword(e.target.value)}
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
