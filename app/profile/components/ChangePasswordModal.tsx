"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import {CurrentUser, getErrorMessage, resendOtp, setPassword, signIn, verifyOtp} from "@/app/common/components/Auth/authApi";
import OtpInput from "@/app/common/components/Auth/OtpInput";

interface ChangePasswordModalProps {
    open: boolean;
    user: CurrentUser;
    onClose: () => void;
}

const CODE_DURATION = 56;
const EMPTY_CODE = ["", "", "", "", "", ""];

function PasswordField({label, value, onChange}: { label: string; value: string; onChange: (v: string) => void }) {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">{label}</span>
            <div className="h-11 rounded-lg bg-[#13181c] border border-[#36393b] flex items-center px-4 gap-2">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={label === "Hozirgi parol" ? "Hozirgi parolni kiriting" : "Yangi parolni kiriting"}
                    className="flex-1 bg-transparent outline-none font-poppins font-medium text-[16px] text-[#f7f9fa] placeholder:text-[#4d555a]"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="cursor-pointer shrink-0">
                    <Image src={show ? "/eye-off-outline.svg" : "/eye-outline.svg"} alt="" width={20} height={20}/>
                </button>
            </div>
        </div>
    );
}

export default function ChangePasswordModal({open, user, onClose}: ChangePasswordModalProps) {
    const [step, setStep] = useState<"form" | "otp">("form");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState<string[]>(EMPTY_CODE);
    const [error, setError] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION);

    useEffect(() => {
        if (!open) return;
        setStep("form");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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

    async function handleSubmitForm() {
        setError(null);
        if (newPassword.length < 6) {
            setError("Yangi parol kamida 6 belgidan iborat bo‘lishi kerak");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Yangi parollar mos kelmadi");
            return;
        }
        setLoading(true);
        try {
            await signIn(user.login, currentPassword);
        } catch {
            setError("Hozirgi parol noto‘g‘ri");
            setLoading(false);
            return;
        }
        try {
            await resendOtp(user.login, user.loginType);
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
            await resendOtp(user.login, user.loginType);
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
            await verifyOtp(user.login, codeStr);
            await setPassword(user.login, codeStr, newPassword);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="relative w-[467px] bg-[#1A1D1F] border border-[#1F272A] rounded-xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-20 border-b border-white/10 flex items-center px-6">
                    <h3 className="font-poppins text-[24px] font-bold leading-[34px] text-[#f7f9fa]">Parolni yangilash</h3>
                </div>
                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10">
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                </button>

                {step === "form" ? (
                    <div className="flex flex-col gap-5 px-6 py-6">
                        <PasswordField label="Hozirgi parol" value={currentPassword} onChange={setCurrentPassword}/>
                        <PasswordField label="Yangi parol" value={newPassword} onChange={setNewPassword}/>
                        <PasswordField label="Yangi parolni tasdiqlang" value={confirmPassword} onChange={setConfirmPassword}/>
                        {error && <p className="font-poppins text-[14px] text-[#dc2d2d]">{error}</p>}
                        <button
                            onClick={handleSubmitForm}
                            disabled={loading}
                            className="h-11 rounded-lg bg-[#1C92E0] font-poppins font-medium text-[16px] text-[#f7f9fa] cursor-pointer hover:bg-[#177db3] disabled:opacity-60"
                        >
                            Yangilash
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 px-6 py-6">
                        <p className="font-poppins font-bold text-[20px] text-[#f7f9fa]">
                            Tasdiqlash uchun maxsus kod {user.loginType === "email" ? "elektron pochtaga" : "quyidagi raqamga"} yuborildi
                        </p>
                        <div className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#13181c] border border-white/20 w-fit">
                            <span className="font-poppins font-medium text-[16px] text-[#f7f9fa]/30">{user.login}</span>
                        </div>
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

