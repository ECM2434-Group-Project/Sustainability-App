
import { UserClaimView } from "../../components/User/UserClaimView"

export function ViewClaimPage() {

    return (
        <section className="p-4">

            <h1 className="text-4xl font-semibold pb-12">View your claims</h1>

            <UserClaimView />

        </section>
    )
}