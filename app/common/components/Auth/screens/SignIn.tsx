import {useState} from "react";
import AuthTabs from "../AuthTabs";
import AuthField from "../AuthField";
import AuthButton from "../AuthButton";
import AuthError from "../AuthError";
import {AuthDraft, AuthMethod} from "../types";

interface SignInProps {
    method: AuthMethod;
    onMethodChange: (method: AuthMethod) => void;
    draft: AuthDraft;
    onDraftChange: (draft: AuthDraft) => void;
    password: string;
    onPasswordChange: (password: string) => void;
    onSubmit: () => void;
    onForgotPassword: () => void;
    onSwitchToSignUp: () => void;
    error: string | null;
    loading: boolean;
}

export default function SignIn({
    method,
    onMethodChange,
    draft,
    onDraftChange,
    password,
    onPasswordChange,
    onSubmit,
    onForgotPassword,
    onSwitchToSignUp,
    error,
    loading,
}: SignInProps) {
    const [submitted, setSubmitted] = useState(false);

    const fieldValue = method === "phone" ? draft.phone : draft.email;
    const fieldEmpty = submitted && !fieldValue.trim();
    const passwordEmpty = submitted && !password.trim();

    function handleSubmit() {
        setSubmitted(true);
        if (!fieldValue.trim() || !password.trim()) return;
        onSubmit();
    }

    return (
        <div className="flex flex-col gap-6 px-6 pt-8">
            <AuthTabs title="Tizimga kirish" method={method} onChange={onMethodChange} />

            <div className="flex flex-col gap-4">
                {method === "phone" ? (
                    <AuthField
                        label="Telefon raqam"
                        placeholder="__ ___ __ __"
                        variant="phone"
                        value={draft.phone}
                        onChange={(v) => onDraftChange({...draft, phone: v})}
                        hasError={fieldEmpty}
                    />
                ) : (
                    <AuthField
                        label="Elektron pochta"
                        placeholder="example@gmail.com"
                        variant="email"
                        value={draft.email}
                        onChange={(v) => onDraftChange({...draft, email: v})}
                        hasError={fieldEmpty}
                    />
                )}

                <AuthField
                    label="Parol"
                    placeholder="Parolingizni kiriting"
                    variant="password"
                    value={password}
                    onChange={onPasswordChange}
                    hasError={passwordEmpty}
                    rightSlot={
                        <button
                            onClick={onForgotPassword}
                            className="font-poppins text-[14px] text-[#1c92e0] cursor-pointer"
                        >
                            Parolni unutdingizmi?
                        </button>
                    }
                />
            </div>

            <AuthError message={error} />

            <div className="flex flex-col gap-3.5">
                <AuthButton onClick={handleSubmit} disabled={loading}>Kirish</AuthButton>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#f7f9fa]/10" />
                    <span className="font-poppins font-medium text-[14px] text-[#f7f9fa]">yoki</span>
                    <div className="flex-1 h-px bg-[#f7f9fa]/10" />
                </div>
                <AuthButton variant="secondary" onClick={onSwitchToSignUp}>
                    Ro‘yxatdan o‘tish
                </AuthButton>
            </div>
        </div>
    );
}