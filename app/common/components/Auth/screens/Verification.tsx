"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import AuthBackHeader from "../AuthBackHeader";
import AuthButton from "../AuthButton";
import AuthError from "../AuthError";
import OtpInput from "../OtpInput";
import {AuthFlow, AuthMethod} from "../types";

interface VerificationProps {
    flow: AuthFlow;
    method: AuthMethod;
    destination: string;
    code: string[];
    onCodeChange: (code: string[]) => void;
    onBack: () => void;
    onEditDestination: () => void;
    onSubmit: () => void;
    onResend: () => Promise<boolean>;
    error: string | null;
    hasError: boolean;
    loading: boolean;
}

const CODE_DURATION = 56;

export default function Verification({
    flow,
    method,
    destination,
    code,
    onCodeChange,
    onBack,
    onEditDestination,
    onSubmit,
    onResend,
    error,
    hasError,
    loading,
}: VerificationProps) {
    const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    async function handleResend() {
        const sent = await onResend();
        if (sent) setSecondsLeft(CODE_DURATION);
    }

    const title = flow === "forgot" ? "Parolni qayta tiklash" : "Telefon raqamni tasdiqlash";
    const subtitle =
        method === "phone"
            ? "Tasdiqlash uchun maxsus kod quyidagi  raqamga yuborildi"
            : "Tasdiqlash uchun maxsus kod elektron pochtaga yuborildi";
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    return (
        <div className="flex flex-col gap-6 px-6 pt-8">
            <AuthBackHeader title={title} onBack={onBack} />

            <p className="w-[419px] font-poppins font-bold text-[20px] text-[#f7f9fa]">{subtitle}</p>

            <button
                onClick={onEditDestination}
                className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#13181c] border border-[#f7f9fa]/10 w-fit cursor-pointer"
            >
                <span className="font-poppins font-medium text-[16px] text-[#f7f9fa]">
                    {method === "phone" ? `+998 ${destination}` : destination}
                </span>
                <Image src="/edit-pencil.svg" alt="" width={16} height={16} />
            </button>

            <div className="flex flex-col gap-3">
                <OtpInput value={code} onChange={onCodeChange} error={hasError} />
                <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">Maxsus kodni kiriting</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="font-poppins text-[16px] text-[#f7f9fa]">Qayta yuborish:</span>
                {secondsLeft > 0 ? (
                    <span className={`font-poppins text-[16px] ${secondsLeft > 30 ? "text-[#82cc27]" : "text-[#e0b531]"}`}>
                        {minutes}:{seconds}
                    </span>
                ) : (
                    <button onClick={handleResend} className="cursor-pointer">
                        <Image src="/refresh.svg" alt="" width={22} height={22} />
                    </button>
                )}
            </div>

            <AuthError message={error} />

            <AuthButton onClick={onSubmit} disabled={loading}>Tasdiqlash</AuthButton>
        </div>
    );
}