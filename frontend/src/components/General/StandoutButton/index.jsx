export function StandoutButton({ children, ...props }) {
    return (
        <button className="bg-exeterBrightGreen text-white flex gap-4 justify-center items-center p-4 rounded-2xl text-lg font-semibold" {...props}>
            {children}
        </button>
    )
}