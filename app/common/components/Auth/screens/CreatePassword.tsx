"use client"
import {useState} from "react";
import AuthBackHeader from "../AuthBackHeader";
import AuthField from "../AuthField";
import AuthButton from "../AuthButton";
import AuthError from "../AuthError";
import {AuthFlow} from "../types";

interface CreatePasswordProps {
    flow: AuthFlow;
    onBack: () => void;
    onSubmit: (password: string) => void;
    error: string | null;
    loading: boolean;
}

const RULES = [
    {label: "6 ta belgidan ko‘p bo‘lish", test: (p: string) => p.length > 6},
    {label: "Kamida 1ta son qatnashishi", test: (p: string) => /\d/.test(p)},
    {label: "Kamida 1ta katta lotin harfi qatnashishi", test: (p: string) => /[A-Z]/.test(p)},
    {label: "Kamida 1ta murakkab simvol qatnashishi", test: (p: string) => /[^A-Za-z0-9]/.test(p)},
];

const BAR_CLS = ["bg-[#dc2d2d]", "bg-[#e0b531]", "bg-[#82cc27]", "bg-[#82cc27]"];

export default function CreatePassword({flow, onBack, onSubmit, error, loading}: CreatePasswordProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passedCount = RULES.filter((rule) => rule.test(password)).length;
    const canSubmit = passedCount === RULES.length && password === confirmPassword;

    return (
        <div className="flex flex-col gap-6 px-6 pt-8">
            <AuthBackHeader title={flow === "forgot" ? "Parolni qayta tiklash" : "Parol qo‘yish"} onBack={onBack} />

            <div className="flex flex-col gap-4">
                <AuthField label="Parol" placeholder="Parolni kiriting" variant="password" value={password} onChange={setPassword} />
                <AuthField
                    label="Parol"
                    placeholder="Parolni takrorlang"
                    variant="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />
            </div>

            <div className="flex flex-col gap-4 w-[419px] p-4 rounded-xl bg-[#13181c]">
                <div className="flex items-center gap-2">
                    {RULES.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 rounded-full ${i < passedCount ? BAR_CLS[passedCount - 1] : "bg-[rgba(247,249,250,0.1)]"}`}
                        />
                    ))}
                </div>
                {RULES.map((rule) => {
                    const done = rule.test(password);
                    return (
                        <div key={rule.label} className="flex items-center gap-2.5">
                            <span className={`block w-1.5 h-1.5 rounded-full ${done ? "bg-[#82cc27]" : "bg-[#747b7f]"}`} />
                            <span className="font-poppins text-[14px] text-[#f7f9fa]">{rule.label}</span>
                        </div>
                    );
                })}
            </div>

            <AuthError message={error} />

            <AuthButton onClick={() => canSubmit && onSubmit(password)} disabled={loading || !canSubmit}>
                Tasdiqlash
            </AuthButton>
        </div>
    );
}