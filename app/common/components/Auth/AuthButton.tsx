interface AuthButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
    disabled?: boolean;
}

export default function AuthButton({children, onClick, variant = "primary", type = "button", disabled = false}: AuthButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-[419px] h-11 rounded-lg font-poppins font-bold text-[16px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                variant === "primary"
                    ? "bg-[#1c92e0] text-[#f7f9fa] hover:bg-[#1879b8]"
                    : "bg-[#13181c] border border-[#36393b] text-[#f7f9fa] hover:bg-[#1a1d1f]"
            }`}
        >
            {children}
        </button>
    );
}