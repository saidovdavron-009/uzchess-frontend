"use client"
import {useEffect} from "react";
import Image from "next/image";

interface LogoutModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({open, onClose, onConfirm}: LogoutModalProps) {
    useEffect(() => {
        if (!open) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="relative w-[440px] bg-[#1A1D1F] border border-[#1F272A] rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-20 border-b border-white/10 flex items-center px-8">
                    <h3 className="font-poppins text-[24px] font-bold leading-[34px] text-[#f7f9fa]">Tzimdan chiqish</h3>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10"
                >
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                </button>

                <div className="flex flex-col items-center px-6 pt-8 pb-6">
                    <div className="w-16 h-16 rounded-full bg-[#DC2D2D] flex items-center justify-center mb-6">
                        <Image src="/ProfileImage/log-out.svg" alt="" width={24} height={24}/>
                    </div>
                    <p className="font-poppins text-[20px] font-bold leading-7 text-center text-[#f7f9fa] mb-7">
                        Rostan ham tizimdan chiqishni tasdiqlaysizmi?
                    </p>
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-11 rounded-lg bg-white/10 font-poppins text-[16px] font-medium text-[#f7f9fa] cursor-pointer hover:bg-white/20"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 h-11 rounded-lg bg-[#1C92E0] font-poppins text-[16px] font-medium text-[#f7f9fa] cursor-pointer hover:bg-[#177db3]"
                        >
                            Davom etish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}