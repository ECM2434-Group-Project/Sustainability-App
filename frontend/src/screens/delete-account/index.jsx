import { GoBackLink } from "../../components/General/GoBackLink";

export default function DeleteAccount() {
    return (
        <section className="p-4 flex flex-col gap-8">
            <GoBackLink href={"/settings"} />

            <div className="flex flex-col gap-4">
                <h1>Are you sure you want to delete your account?</h1>
                <button className="border-[1.2px] border-black p-4 rounded text-white bg-red-600">Delete</button>
            </div>
        </section>
    )
}