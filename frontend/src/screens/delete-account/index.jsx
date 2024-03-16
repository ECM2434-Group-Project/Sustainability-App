import { GoBackLink } from "../../components/General/GoBackLink";
import { client } from "../../axios";
import { useCallback, useState } from "react";

export default function DeleteAccount() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const deleteUser = useCallback(() => {
        if (email === "") {
            alert("Email cannot be empty");
            return;
        }

        if (password === "") {
            alert("Password cannot be empty");
            return;
        }

        client.post("/api/user/deleteuser", {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response.headers);
            if (response.status === 200) {
                alert("Account deleted successfully");
            } else {
                alert("Error deleting account");
            }
        }
        ).catch((error) => {
            console.log(error);
            alert("Error deleting account");
        });
        }
        , [email, password]);

    return (
        <section className="flex justify-center p-10">
        <div className="absolute top-2 left-2 z-10">
				<GoBackLink href={-1} />
		</div>
      <div className="w-full">
      <h1>Are you sure you want to delete your account?</h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={deleteUser}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
          <button className="border-[1.2px] border-black p-4 rounded text-white bg-red-600" type="submit">Delete</button>
          </div>
        </form>
      </div>
    </section>
    )
}