export function TextInput({ label, value, onChange, type, placeholder, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label>
                <small>{label}</small>
            </label>
            <input
                className="rounded-md p-4 py-2 bg-white text-gray-950"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    )
}