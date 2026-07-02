"use client"
import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import AuthPanel from "./AuthPanel";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Verification from "./screens/Verification";
import CreatePassword from "./screens/CreatePassword";
import {AuthDraft, AuthFlow, AuthMethod, AuthStep} from "./types";
import * as authApi from "./authApi";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialStep?: AuthStep;
}

const EMPTY_DRAFT: AuthDraft = {name: "", phone: "", email: ""};
const EMPTY_CODE = ["", "", "", "", "", ""];

export default function AuthModal({open, onClose, onSuccess, initialStep = "signin"}: AuthModalProps) {
    const [step, setStep] = useState<AuthStep>(initialStep);
    const [flow, setFlow] = useState<AuthFlow>("signup");
    const [method, setMethod] = useState<AuthMethod>("phone");
    const [draft, setDraft] = useState<AuthDraft>(EMPTY_DRAFT);
    const [signInPassword, setSignInPassword] = useState("");
    const [code, setCode] = useState<string[]>(EMPTY_CODE);
    const [error, setError] = useState<string | null>(null);
    const [otpError, setOtpError] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentLogin = authApi.toLogin(method, draft);
    const currentLoginType = authApi.toLoginType(method);

    const handleClose = useCallback(() => {
        setStep(initialStep);
        setFlow("signup");
        setMethod("phone");
        setDraft(EMPTY_DRAFT);
        setSignInPassword("");
        setCode(EMPTY_CODE);
        setError(null);
        setOtpError(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (open) setStep(initialStep);
    }, [open, initialStep]);

    useEffect(() => {
        if (!open) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") handleClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, handleClose]);

    function goToStep(next: AuthStep) {
        setError(null);
        setOtpError(false);
        setStep(next);
    }

    async function handleSignIn() {
        setError(null);
        setLoading(true);
        try {
            const {accessToken} = await authApi.signIn(currentLogin, signInPassword);
            authApi.saveToken(accessToken);
            onSuccess();
            handleClose();
        } catch (e) {
            setError(authApi.getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleSignUp() {
        setError(null);
        setLoading(true);
        try {
            await authApi.signUp(draft.name.trim(), currentLogin, currentLoginType);
            setFlow("signup");
            setCode(EMPTY_CODE);
            goToStep("verify");
        } catch (e) {
            setError(authApi.getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleForgotPassword() {
        setError(null);
        setLoading(true);
        try {
            await authApi.resendOtp(currentLogin, currentLoginType);
            setFlow("forgot");
            setCode(EMPTY_CODE);
            goToStep("verify");
        } catch (e) {
            setError(authApi.getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify() {
        setError(null);
        setOtpError(false);
        const codeStr = code.join("");
        if (codeStr.length < 6) {
            setError("Kodni to‘liq kiriting");
            return;
        }
        setLoading(true);
        try {
            await authApi.verifyOtp(currentLogin, codeStr);
            goToStep("create-password");
        } catch (e) {
            setOtpError(true);
            setError(authApi.getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleResendOtp(): Promise<boolean> {
        setError(null);
        try {
            await authApi.resendOtp(currentLogin, currentLoginType);
            return true;
        } catch (e) {
            setError(authApi.getErrorMessage(e));
            return false;
        }
    }

    async function handleCreatePassword(password: string) {
        setError(null);
        setLoading(true);
        try {
            await authApi.setPassword(currentLogin, code.join(""), password);
            try {
                const {accessToken} = await authApi.signIn(currentLogin, password);
                authApi.saveToken(accessToken);
                onSuccess();
            } catch {
            }
            handleClose();
        } catch (e) {
            setError(authApi.getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={handleClose}
        >
            <div className="relative flex items-start" onClick={(e) => e.stopPropagation()}>
                <div className="w-[910px] h-[597px] rounded-xl bg-[#1a1d1f] border border-[#1e262a] flex overflow-hidden">
                    <div className="w-[467px] h-full overflow-y-auto pb-8">
                        {step === "signin" && (
                            <SignIn
                                method={method}
                                onMethodChange={setMethod}
                                draft={draft}
                                onDraftChange={setDraft}
                                password={signInPassword}
                                onPasswordChange={setSignInPassword}
                                onSubmit={handleSignIn}
                                onForgotPassword={handleForgotPassword}
                                onSwitchToSignUp={() => goToStep("signup")}
                                error={error}
                                loading={loading}
                            />
                        )}
                        {step === "signup" && (
                            <SignUp
                                method={method}
                                onMethodChange={setMethod}
                                draft={draft}
                                onDraftChange={setDraft}
                                onSubmit={handleSignUp}
                                onSwitchToSignIn={() => goToStep("signin")}
                                error={error}
                                loading={loading}
                            />
                        )}
                        {step === "verify" && (
                            <Verification
                                flow={flow}
                                method={method}
                                destination={method === "phone" ? draft.phone : draft.email}
                                code={code}
                                onCodeChange={(next) => {
                                    setOtpError(false);
                                    setCode(next);
                                }}
                                onBack={() => goToStep(flow === "forgot" ? "signin" : "signup")}
                                onEditDestination={() => goToStep(flow === "forgot" ? "signin" : "signup")}
                                onSubmit={handleVerify}
                                onResend={handleResendOtp}
                                error={error}
                                hasError={otpError}
                                loading={loading}
                            />
                        )}
                        {step === "create-password" && (
                            <CreatePassword
                                flow={flow}
                                onBack={() => goToStep("verify")}
                                onSubmit={handleCreatePassword}
                                error={error}
                                loading={loading}
                            />
                        )}
                    </div>
                    <AuthPanel />
                </div>

                <button
                    onClick={handleClose}
                    className="absolute top-1 left-[926px] w-10 h-10 rounded-lg bg-[#1a1d1f] flex items-center justify-center cursor-pointer hover:bg-[#232627]"
                >
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18} />
                </button>
            </div>
        </div>
    );
}