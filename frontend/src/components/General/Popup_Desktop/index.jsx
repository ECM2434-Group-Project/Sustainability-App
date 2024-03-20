import { IoCloseSharp } from "react-icons/io5"


export function Popup({ trigger, setTrigger, children }) {
    return trigger ? (
        <section className="absolute top-0 left-0 w-screen h-screen bg-opacity-5 bg-black flex flex-col items-center justify-center z-50">
            <div className="bg-white p-4 py-8 w-1/2 h-2/3 rounded-xl overflow-auto">
                <div className="flex justify-end">
                    <button
                        className="p-3 bg-white shadow  rounded-full"
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