"use client"
import Image from "next/image";

interface LessonLockedModalProps {
    open: boolean;
    onClose: () => void;
    onBuy: () => void;
}

export default function LessonLockedModal({open, onClose, onBuy}: LessonLockedModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(12,13,15,0.94)]"
            onClick={onClose}
        >
            <div className="flex flex-col items-center gap-[56px]" onClick={e => e.stopPropagation()}>
                <Image src="/icon1.svg" alt="UzChess" width={135} height={34}/>

                <div className="relative w-[728px] h-[478px]">
                    <div className="w-full h-full bg-[#1A1D1F] rounded-[12px] border border-[#1F272A] overflow-hidden flex pl-[20px] gap-[20px]">
                        <div className="w-[335px] shrink-0 flex flex-col items-center text-center pt-[62px] pb-[20px]">
                            <Image src="/icon-locked-screen.svg" alt="" width={236} height={179}/>

                            <h3 className="mt-[36px] text-[16px] font-bold text-[#f7f9fa] font-poppins text-center leading-snug">
                                Kursni davom ettirish uchun to&apos;lovni amalga oshirishingiz zarur.
                            </h3>
                            <p className="mt-[10px] text-[13px] font-medium text-[#9DA1A3] font-poppins text-center">
                                Biz bilan shaxmatni qayta kashf eting, keyingi darsliklardan ko&apos;plab ma&apos;lumotlar olishingiz mumkin.
                            </p>

                            <button
                                onClick={onBuy}
                                className="w-full h-[36px] mt-[40px] rounded-[8px] bg-[#1c92e0] hover:bg-[#1a7fc7] transition-colors text-[#f7f9fa] text-[13px] font-bold font-poppins"
                            >
                                Sotib olish
                            </button>
                        </div>

                        <div className="relative w-[354px] shrink-0">
                            <Image src="/lesson-locked-promo.png" alt="" fill className="object-cover"/>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute -top-[38px] -right-[38px] w-[32px] h-[32px] rounded-[8px] bg-[#1a1d1f] hover:bg-[#232627] flex items-center justify-center transition-colors"
                        aria-label="Yopish"
                    >
                        <Image src="/close-x.svg" alt="" width={14} height={14}/>
                    </button>
                </div>
            </div>
        </div>
    );
}