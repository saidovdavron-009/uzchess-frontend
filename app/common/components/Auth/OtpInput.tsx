"use client"
import {useRef} from "react";

interface OtpInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    error?: boolean;
}

export default function OtpInput({value, onChange, error = false}: OtpInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    function setDigit(index: number, digit: string) {
        const next = [...value];
        next[index] = digit;
        onChange(next);
        if (digit && index < 5) inputsRef.current[index + 1]?.focus();
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length) {
            e.preventDefault();
            const next = ["", "", "", "", "", ""];
            digits.forEach((d, i) => (next[i] = d));
            onChange(next);
            inputsRef.current[Math.min(digits.length, 5)]?.focus();
        }
    }

    return (
        <div className="flex items-center gap-2.5">
            {value.map((digit, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        inputsRef.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, "").slice(-1))}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-[50px] h-11 rounded-lg bg-[#13181c] border text-center font-poppins font-bold text-[24px] text-[#f7f9fa] outline-none ${
                        error ? "border-[#dc2d2d]" : "border-[#454f54] focus:border-[#1c92e0]"
                    }`}
                />
            ))}
        </div>
    );
}
