"use client"
import {useState} from "react";
import Image from "next/image";

function formatUzPhone(digits: string) {
    const d = digits.replace(/\D/g, "").slice(0, 9);
    const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
    return parts.join(" ");
}

interface AuthFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    variant?: "text" | "email" | "phone" | "password";
    rightSlot?: React.ReactNode;
    hasError?: boolean;
}

export default function AuthField({label, placeholder, value, onChange, variant = "text", rightSlot, hasError}: AuthFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2 w-[419px]">
            <div className="flex items-center justify-between">
                <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">{label}</span>
                {rightSlot}
            </div>
            <div className={`h-11 w-full rounded-lg bg-[#13181c] border ${hasError ? "border-[#E53935]" : "border-[#36393b]"} flex items-center px-4 gap-2 transition-colors`}>
                {variant === "phone" && (
                    <span className="font-poppins font-medium text-[14px] text-[#f7f9fa]">+998</span>
                )}
                <input
                    type={variant === "password" && !showPassword ? "password" : "text"}
                    inputMode={variant === "phone" ? "numeric" : undefined}
                    value={variant === "phone" ? formatUzPhone(value) : value}
                    onChange={(e) => onChange(variant === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 9) : e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none font-poppins font-medium text-[16px] text-[#f7f9fa] placeholder:text-[#4d555a]"
                />
                {variant === "password" && (
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="cursor-pointer shrink-0">
                        <Image
                            src={showPassword ? "/eye-off-outline.svg" : "/eye-outline.svg"}
                            alt=""
                            width={20}
                            height={20}
                        />
                    </button>
                )}
            </div>
            {hasError && (
                <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
            )}
        </div>
    );
}