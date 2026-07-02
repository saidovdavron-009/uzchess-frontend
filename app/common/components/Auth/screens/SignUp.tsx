import {useState} from "react";
import AuthTabs from "../AuthTabs";
import AuthField from "../AuthField";
import AuthButton from "../AuthButton";
import AuthError from "../AuthError";
import {AuthDraft, AuthMethod} from "../types";

interface SignUpProps {
    method: AuthMethod;
    onMethodChange: (method: AuthMethod) => void;
    draft: AuthDraft;
    onDraftChange: (draft: AuthDraft) => void;
    onSubmit: () => void;
    onSwitchToSignIn: () => void;
    error: string | null;
    loading: boolean;
}

export default function SignUp({method, onMethodChange, draft, onDraftChange, onSubmit, onSwitchToSignIn, error, loading}: SignUpProps) {
    const [submitted, setSubmitted] = useState(false);

    const fieldValue = method === "phone" ? draft.phone : draft.email;
    const nameEmpty = submitted && !draft.name.trim();
    const fieldEmpty = submitted && !fieldValue.trim();

    function handleSubmit() {
        setSubmitted(true);
        if (!draft.name.trim() || !fieldValue.trim()) return;
        onSubmit();
    }

    return (
        <div className="flex flex-col gap-6 px-6 pt-8">
            <AuthTabs title="Ro’yxatdan o’tish" method={method} onChange={onMethodChange} />

            <div className="flex flex-col gap-4">
                <AuthField
                    label={method === "phone" ? "Ism-sharifingiz" : "Ism"}
                    placeholder={method === "phone" ? "Ism-sharifingizini kiriting" : "Ismingizni kiriting"}
                    value={draft.name}
                    onChange={(v) => onDraftChange({...draft, name: v})}
                    hasError={nameEmpty}
                />
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
            </div>

            <p className="w-[419px] font-poppins text-[14px] text-[#85898b]">
                Ro’yxatdan o’tish tugmasini bosgach foydalanish shartlari va qoidalarini qabul qilaman
            </p>

            <AuthError message={error} />

            <div className="flex flex-col gap-3.5">
                <AuthButton onClick={handleSubmit} disabled={loading}>Ro’yxatdan o’tish</AuthButton>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#f7f9fa]/10" />
                    <span className="font-poppins font-medium text-[14px] text-[#f7f9fa]">yoki</span>
                    <div className="flex-1 h-px bg-[#f7f9fa]/10" />
                </div>
                <AuthButton variant="secondary" onClick={onSwitchToSignIn}>
                    Kirish
                </AuthButton>
            </div>
        </div>
    );
}
