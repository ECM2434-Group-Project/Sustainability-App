
import { GoBackLink } from "../../components/General/GoBackLink"
import { UserClaimView } from "../../components/User/UserClaimView"

export function ViewClaimPage() {

    return (
        <section className="p-4">

            <GoBackLink href={"/"} />

            <h1 className="text-4xl font-semibold pb-12">View your claims</h1>

            <UserClaimView />

        </section>
    )
}