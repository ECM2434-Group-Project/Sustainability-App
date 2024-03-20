import { IoCloseSharp } from "react-icons/io5"


export function Popup({ trigger, setTrigger, children }) {
    return trigger ? (
        <section className="absolute top-0 left-0 w-screen h-screen bg-opacity-5 bg-black flex flex-col items-center justify-center z-50">
            <div className="relative bg-white w-1/2 h-2/3 rounded-xl overflow-auto">
                <div className="absolute top-0 right-0 p-4">
                    <button
                        className="p-3 bg-slate-300 shadow rounded-full"
                        onClick={() => setTrigger(false)}
                    >
                        <IoCloseSharp/>
                    </button>
                </div>
                {children}
            </div>
        </section>
    ) : (
        <></>
    )
}