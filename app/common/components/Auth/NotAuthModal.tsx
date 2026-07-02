"use client"
import Image from "next/image";
import AuthPanel from "./AuthPanel";

interface NotAuthModalProps {
    open: boolean;
    onClose: () => void;
    onSignIn: () => void;
    onSignUp: () => void;
}

export default function NotAuthModal({open, onClose, onSignIn, onSignUp}: NotAuthModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div className="flex flex-col items-center gap-[20px]" onClick={(e) => e.stopPropagation()}>
                <Image src="/icon1.svg" alt="UzChess" width={104} height={28}/>

                <div className="relative flex items-start">
                <div className="w-[910px] h-[597px] rounded-xl bg-[#1a1d1f] border border-[#1e262a] flex overflow-hidden">

                    <div className="w-[467px] h-full flex flex-col items-center justify-center px-[24px] gap-[20px]">
                        <Image
                            src="/not-auth-lock.png"
                            alt="lock"
                            width={272}
                            height={210}
                            className="shrink-0"
                        />

                        <h2 className="w-[419px] text-[#F7F9FA] text-[20px] font-bold font-poppins text-center leading-[1.4]">
                            UzChess platformasidan to&apos;liq foydalanish uchun tizimga kiring
                        </h2>

                        <p className="w-[419px] text-[#9DA1A3] text-[16px] font-medium font-poppins text-center leading-[1.4]">
                            Platformaning barcha imkoniyatlaridan foydalanish uchun tizimga kirishingiz kerak
                        </p>

                        <button
                            onClick={onSignIn}
                            className="w-[419px] h-[45px] bg-[#1c91e0] rounded-[8px] text-[#F7F9FA] text-[16px] font-bold font-poppins hover:opacity-90 transition-opacity"
                        >
                            Kirish
                        </button>

                        <button
                            onClick={onSignUp}
                            className="w-[419px] h-[45px] bg-white/10 rounded-[8px] text-[#F7F9FA] text-[16px] font-bold font-poppins hover:bg-white/20 transition-colors"
                        >
                            Ro&apos;yxatdan o&apos;tish
                        </button>
                    </div>

                    <AuthPanel/>
                </div>

                    <button
                        onClick={onClose}
                        className="absolute top-1 left-[926px] w-10 h-10 rounded-lg bg-[#1a1d1f] flex items-center justify-center cursor-pointer hover:bg-[#232627]"
                    >
                        <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
}
