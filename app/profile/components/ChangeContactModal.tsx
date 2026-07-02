"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import {
    CurrentUser,
    getErrorMessage,
    markVerified,
    resendOtp,
    signIn,
    updateLogin,
    verifyOtp,
} from "@/app/common/components/Auth/authApi";
import OtpInput from "@/app/common/components/Auth/OtpInput";

interface ChangeContactModalProps {
    open: boolean;
    mode: "phone" | "email";
    user: CurrentUser;
    token: string;
    onClose: () => void;
    onSuccess: (login: string) => void;
}

const CODE_DURATION = 56;
const EMPTY_CODE = ["", "", "", "", "", ""];

function formatUzPhone(digits: string) {
    const d = digits.replace(/\D/g, "").slice(0, 9);
    return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

export default function ChangeContactModal({open, mode, user, token, onClose, onSuccess}: ChangeContactModalProps) {
    const [step, setStep] = useState<"form" | "otp">("form");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [newLogin, setNewLogin] = useState("");
    const [code, setCode] = useState<string[]>(EMPTY_CODE);
    const [error, setError] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION);

    useEffect(() => {
        if (!open) return;
        setStep("form");
        setPassword("");
        setNewValue("");
        setNewLogin("");
        setCode(EMPTY_CODE);
        setError(null);
        setHasError(false);
    }, [open]);

    useEffect(() => {
        if (step !== "otp" || secondsLeft <= 0) return;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [step, secondsLeft]);

    if (!open) return null;

    const loginType = mode === "phone" ? "number" : "email";

    async function handleClose() {
        if (step === "otp" && newLogin) {
            try {
                await updateLogin(user.id, token, user.login, user.loginType);
            } catch {
            }
        }
        onClose();
    }

    async function handleSubmitForm() {
        setError(null);
        const candidateLogin = mode === "phone" ? `+998${newValue}` : newValue.trim();
        if (mode === "phone" && newValue.replace(/\D/g, "").length !== 9) {
            setError("Telefon raqamini to‘liq kiriting");
            return;
        }
        if (mode === "email" && !/^\S+@\S+\.\S+$/.test(candidateLogin)) {
            setError("Elektron pochta manzilini to‘g‘ri kiriting");
            return;
        }
        setLoading(true);
        try {
            await signIn(user.login, password);
        } catch {
            setError("Parol noto‘g‘ri");
            setLoading(false);
            return;
        }
        try {
            await updateLogin(user.id, token, candidateLogin, loginType);
            await resendOtp(candidateLogin, loginType);
            setNewLogin(candidateLogin);
            setSecondsLeft(CODE_DURATION);
            setStep("otp");
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        try {
            await resendOtp(newLogin, loginType);
            setSecondsLeft(CODE_DURATION);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    async function handleConfirmOtp() {
        setError(null);
        setHasError(false);
        const codeStr = code.join("");
        if (codeStr.length < 6) {
            setError("Kodni to‘liq kiriting");
            return;
        }
        setLoading(true);
        try {
            await verifyOtp(newLogin, codeStr);
            await markVerified(user.id, token);
            onSuccess(newLogin);
            onClose();
        } catch (e) {
            setHasError(true);
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    const title = mode === "phone" ? "Telefon raqamni yangilash" : "Elektron pochtani yangilash";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={handleClose}>
            <div className="relative w-[467px] bg-[#1A1D1F] border border-[#1F272A] rounded-xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-20 border-b border-white/10 flex items-center px-6">
                    <h3 className="font-poppins text-[24px] font-bold leading-[34px] text-[#f7f9fa]">{title}</h3>
                </div>
                <button onClick={handleClose} className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10">
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                </button>

                {step === "form" ? (
                    <div className="flex flex-col gap-5 px-6 py-6">
                        <div className="flex flex-col gap-2">
                            <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">Parol</span>
                            <div className="h-11 rounded-lg bg-[#13181c] border border-[#36393b] flex items-center px-4 gap-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Parolni kiriting"
                                    className="flex-1 bg-transparent outline-none font-poppins font-medium text-[16px] text-[#f7f9fa] placeholder:text-[#4d555a]"
                                />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} className="cursor-pointer shrink-0">
                                    <Image src={showPassword ? "/eye-off-outline.svg" : "/eye-outline.svg"} alt="" width={20} height={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">
                                {mode === "phone" ? "Yangi telefon raqamingizni kiriting" : "Yangi elektron pochtangizni kiriting"}
                            </span>
                            <div className="h-11 rounded-lg bg-[#13181c] border border-[#36393b] flex items-center px-4 gap-2">
                                {mode === "phone" && <span className="font-poppins font-medium text-[14px] text-[#f7f9fa]">+998</span>}
                                <input
                                    inputMode={mode === "phone" ? "numeric" : undefined}
                                    type={mode === "email" ? "email" : "text"}
                                    value={mode === "phone" ? formatUzPhone(newValue) : newValue}
                                    onChange={(e) => setNewValue(mode === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 9) : e.target.value)}
                                    placeholder={mode === "phone" ? "__ ___ __ __" : "example@uzchess.uz"}
                                    className="flex-1 bg-transparent outline-none font-poppins font-medium text-[16px] text-[#f7f9fa] placeholder:text-[#4d555a]"
                                />
                            </div>
                        </div>

                        {error && <p className="font-poppins text-[14px] text-[#dc2d2d]">{error}</p>}

                        <button
                            onClick={handleSubmitForm}
                            disabled={loading}
                            className="h-11 rounded-lg bg-[#1C92E0] font-poppins font-medium text-[16px] text-[#f7f9fa] cursor-pointer hover:bg-[#177db3] disabled:opacity-60"
                        >
                            Davom ettirish
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 px-6 py-6">
                        <p className="font-poppins font-bold text-[20px] text-[#f7f9fa]">
                            Tasdiqlash uchun maxsus kod {mode === "phone" ? "quyidagi raqamga" : "elektron pochtaga"} yuborildi
                        </p>
                        <button
                            onClick={() => setStep("form")}
                            className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#13181c] border border-white/20 w-fit cursor-pointer"
                        >
                            <span className="font-poppins font-medium text-[16px] text-[#f7f9fa]/30">{newLogin}</span>
                            <Image src="/edit-pencil.svg" alt="" width={16} height={16}/>
                        </button>
                        <div className="flex flex-col gap-3">
                            <OtpInput value={code} onChange={setCode} error={hasError}/>
                            <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">Maxsus kodni kiriting</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-poppins text-[16px] text-[#f7f9fa]/70">Qayta yuborish:</span>
                            {secondsLeft > 0 ? (
                                <span className="px-2.5 py-1 rounded bg-[#e0b531]/10 font-poppins text-[16px] text-[#e0b531]">{minutes}:{seconds}</span>
                            ) : (
                                <button onClick={handleResend} className="cursor-pointer">
                                    <Image src="/refresh.svg" alt="" width={22} height={22}/>
                                </button>
                            )}
                        </div>
                        {error && <p className="font-poppins text-[14px] text-[#dc2d2d]">{error}</p>}
                        <button
                            onClick={handleConfirmOtp}
                            disabled={loading}
                            className="h-11 rounded-lg bg-[#1C92E0] font-poppins font-medium text-[16px] text-[#f7f9fa] cursor-pointer hover:bg-[#177db3] disabled:opacity-60"
                        >
                            Tasdiqlash
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}