export function StandoutButton({ children, disabled=false, ...props }) {
    return (
        <button
            className={
                !disabled ? 
                    "bg-exeterBrightGreen bg-gradient-to-r from-exeterDeepGreen via-exeterBrightGreen to-exeterHighlightGreen text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                    : "bg-gray-600 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold"
                }
                disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}