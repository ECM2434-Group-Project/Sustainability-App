
import { GoBackLink } from "../../components/General/GoBackLink"
import { UserClaimView } from "../../components/User/UserClaimView"
import { UserAvatar } from "../../components/User/UserAvatar"
import { GoBackLink } from "../../components/General/GoBackLink"

export function ViewClaimPage() {

    return (
        <section className="p-6">

            <div className="absolute top-2 left-2 z-10">
				<GoBackLink href={"/outlet"} />
			</div>

            <div className="flex justify-end">
				<UserAvatar />
			</div>

            <h1 className="text-4xl font-semibold pb-12">View your claims</h1>

            <UserClaimView />

        </section>
    )
}