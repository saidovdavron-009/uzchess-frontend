"use client"
import Image from "next/image";
import {useEffect, useState} from "react";

type PaymentMethod = "paylov" | "payme" | "click" | "uzum";
type Step = "payment" | "processing" | "success";

interface PurchaseModalProps {
    open: boolean;
    onClose: () => void;
    courseTitle: string;
    price: string;
    onPurchased?: () => void;
}

const PAYMENTS: {id: PaymentMethod; logo: string; logoW: number; logoH: number; activeCls: string; inactiveCls: string}[] = [
    {id: "paylov", logo: "/payment-paylov.png", logoW: 61, logoH: 20, activeCls: "bg-[#1a2932] border border-[#163d57]",  inactiveCls: "bg-[#13181b] border border-[#36393b]/40"},
    {id: "payme",  logo: "/payment-payme.png",  logoW: 69, logoH: 24, activeCls: "bg-[#1a2932] border border-[#163d57]",  inactiveCls: "bg-[#13181b] border border-[#36393b]/40"},
    {id: "click",  logo: "/payment-click.png",  logoW: 71, logoH: 24, activeCls: "bg-[#1a2932] border border-[#163d57]",  inactiveCls: "bg-[#13181b] border border-[#36393b]/40"},
    {id: "uzum",   logo: "/payment-uzum.png",   logoW: 60, logoH: 24, activeCls: "bg-[#1a2932] border border-[#163d57]",  inactiveCls: "bg-[#1b2a33] border border-[#36393b]/40"},
];

function formatPrice(raw: string) {
    const n = parseFloat(raw);
    if (isNaN(n)) return raw;
    return n.toLocaleString("ru-RU") + ".00 UZS";
}

export default function PurchaseModal({open, onClose, courseTitle, price, onPurchased}: PurchaseModalProps) {
    const [selected, setSelected] = useState<PaymentMethod>("paylov");
    const [step, setStep] = useState<Step>("payment");

    useEffect(() => {
        if (step !== "processing") return;
        const timer = setTimeout(() => setStep("success"), 2500);
        return () => clearTimeout(timer);
    }, [step]);

    function handleClose() {
        setStep("payment");
        onClose();
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(12,13,15,0.94)]"
            onClick={handleClose}
        >
            <div className="relative" onClick={e => e.stopPropagation()}>

                {step === "success" ? (
                    <div className="w-[440px] bg-[#1a1d1f] rounded-[12px] border-[1.5px] border-[#1f272a] flex flex-col items-center px-[24px] pt-[48px] pb-[32px]">
                        <Image src="/galochka.png" alt="" width={72} height={72} className="object-contain"/>
                        <span className="text-[#f7f9fa] text-[22px] font-bold font-poppins leading-tight text-center mt-[20px]">
                            Kurs muvaffaqiyatli sotib<br/>olindi
                        </span>
                        <span className="text-[#9da1a3] text-[14px] font-normal font-poppins text-center mt-[10px]">
                            Tabriklaymiz siz kursni muvaffaqiyatli<br/>sotib oldingiz!
                        </span>
                        <button
                            onClick={() => { onPurchased?.(); handleClose(); }}
                            className="w-full h-[44px] rounded-[8px] bg-[#1c91e0] hover:bg-[#1a7fc7] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors mt-[24px]"
                        >
                            Kursni ko&apos;rish
                        </button>
                    </div>

                ) : step === "processing" ? (
                    <div className="w-[440px] bg-[#1a1d1f] rounded-[12px] border-[1.5px] border-[#1f272a] flex flex-col items-center px-[24px] pt-[48px] pb-[32px] gap-[16px]">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#f5a623] flex items-center justify-center">
                            <Image src="/hourglass.svg" alt="" width={36} height={36} className="object-contain brightness-0 invert"/>
                        </div>
                        <div className="flex flex-col items-center gap-[8px] text-center">
                            <span className="text-[#f7f9fa] text-[24px] font-bold font-poppins">
                                Jarayonda...
                            </span>
                            <span className="text-[#9da1a3] text-[14px] font-normal font-poppins">
                                To&apos;lov amalga oshish jarayonida
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-full h-[44px] rounded-[8px] bg-[#1c91e0] hover:bg-[#1a7fc7] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors mt-[8px]"
                        >
                            Tushunarli
                        </button>
                    </div>

                ) : (
                    <div className="w-[440px] bg-[#1a1d1f] rounded-[12px] border border-[#1f272a] flex flex-col items-center overflow-hidden">
                        <div className="mt-[10px]">
                            <Image src="/pay.svg" alt="" width={150} height={150}/>
                        </div>

                        <div className="w-[392px] rounded-[12px] border-[1.6px] border-[#36393b]/40 flex flex-col items-center gap-[8px] px-[12px] py-[12px]">
                            <span className="text-[#9fa1a2] text-[16px] font-normal font-poppins text-center">
                                Xarid qilinayotgan kurs:
                            </span>
                            <span className="text-[#f7f9fa] text-[20px] font-bold font-poppins text-center leading-tight">
                                {courseTitle}
                            </span>
                            <div className="flex items-center gap-[12px]">
                                <Image src="/purchase-cash-icon.png" alt="" width={28} height={28} className="object-contain"/>
                                <span className="text-[#f7f9fa] text-[20px] font-bold font-poppins">
                                    {formatPrice(price)}
                                </span>
                            </div>
                        </div>

                        <div className="w-[392px] flex flex-col mt-[18px]">
                            <span className="text-[#9da1a3] text-[16px] font-medium font-poppins">
                                To&apos;lov usulini tanlang
                            </span>
                            <div className="flex gap-[16px] mt-[12px]">
                                {PAYMENTS.slice(0, 2).map(pm => (
                                    <PaymentCard key={pm.id} pm={pm} active={selected === pm.id} onSelect={() => setSelected(pm.id)}/>
                                ))}
                            </div>
                            <div className="flex gap-[16px] mt-[12px]">
                                {PAYMENTS.slice(2, 4).map(pm => (
                                    <PaymentCard key={pm.id} pm={pm} active={selected === pm.id} onSelect={() => setSelected(pm.id)}/>
                                ))}
                            </div>
                        </div>

                        <div className="w-[392px] flex gap-[16px] mt-[36px] mb-[24px]">
                            <button
                                onClick={handleClose}
                                className="flex-1 h-[44px] rounded-[8px] bg-white/10 hover:bg-white/[0.15] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={() => setStep("processing")}
                                className="flex-1 h-[44px] rounded-[8px] bg-[#1c91e0] hover:bg-[#1a7fc7] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors"
                            >
                                Davom etish
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleClose}
                    className="absolute top-0 left-[452px] w-[40px] h-[40px] rounded-[8px] bg-[#1a1d1f] hover:bg-[#232627] flex items-center justify-center transition-colors"
                >
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                </button>
            </div>
        </div>
    );
}

function PaymentCard({pm, active, onSelect}: {
    pm: typeof PAYMENTS[number];
    active: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={`flex-1 h-[48px] rounded-[8px] flex items-center justify-between px-[16px] transition-colors ${active ? pm.activeCls : pm.inactiveCls}`}
        >
            <Image src={pm.logo} alt={pm.id} width={pm.logoW} height={pm.logoH} className="object-contain"/>
            <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 ${active ? "bg-[#1c91e0]" : "bg-[#4a5358]"}`}>
                <div className={`rounded-full ${active ? "w-[10px] h-[10px] bg-[#f7f9fa]" : "w-[14px] h-[14px] bg-[#2e393f]"}`}/>
            </div>
        </button>
    );
}
