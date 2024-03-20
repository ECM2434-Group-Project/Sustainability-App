import { IoCloseSharp } from "react-icons/io5"


export function Popup({ trigger, setTrigger, children }) {
    return trigger ? (
        <section className="absolute top-0 left-0 z-10 w-screen h-screen bg-opacity-5 bg-black flex flex-col items-center">
            <div className="bg-white p-4 py-8 w-screen h-screen">
                <div className="flex justify-end">
                    <button
                        className="p-3 bg-white shadow rounded-full"
                        onClick={() => setTrigger(false)}
                    >
                        <IoCloseSharp />
                    </button>
                </div>
                {children}
            </div>
        </section>
    ) : (
        <></>
    )
}