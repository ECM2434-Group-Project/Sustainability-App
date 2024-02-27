import { PulsatingDot } from "../../General/PulsatingDot";

export function OnCampusIndicator() {
    return (
        <div className="bg-white flex items-center gap-4 p-2">

            <PulsatingDot />

            <span>On campus</span>

        </div>
    )
}