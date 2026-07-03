"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import {getToken} from "@/app/common/components/Auth/authApi";
import {fetchReportCategories, ReportCategory, submitReport} from "@/app/common/api/reportApi";

export default function ReportModal({target, targetId, onClose}: {
    target: string;
    targetId: number;
    onClose: () => void;
}) {
    const [categories, setCategories] = useState<ReportCategory[]>([]);
    const [category, setCategory] = useState<ReportCategory | null>(null);
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        fetchReportCategories().then(setCategories);
    }, []);

    async function handleSubmit() {
        const token = getToken();
        if (!token || !category) return;
        setSubmitting(true);
        const ok = await submitReport(token, category.id, target, targetId, description.trim());
        setSubmitting(false);
        if (ok) setSent(true);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(12,13,15,0.94)]" onClick={onClose}>
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-0 left-[452px] w-[40px] h-[40px] rounded-[8px] bg-[#1a1d1f] hover:bg-[#232627] flex items-center justify-center transition-colors">
                    <Image src="/modal-x.svg" alt="" width={18} height={18}/>
                </button>

                <div className="w-[440px] bg-[#1a1d1f] rounded-[12px] border border-[#1f272a] flex flex-col">
                    <div className="h-[80px] px-[24px] flex items-center gap-[8px] border-b border-[#f7f9fa]/[0.16]">
                        {!sent && category && (
                            <button onClick={() => setCategory(null)} className="w-[32px] h-[32px] flex items-center justify-center shrink-0 -ml-1">
                                <Image src="/icon-chevron-right-sm.svg" alt="" width={24} height={24} className="rotate-180"/>
                            </button>
                        )}
                        <h2 className="text-[#f7f9fa] text-[24px] font-bold font-poppins leading-[1.35]">Shikoyat qilish</h2>
                    </div>

                    <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">
                        {sent ? (
                            <div className="flex flex-col items-center gap-[16px] py-[16px]">
                                <Image src="/icon-check-green.svg" alt="" width={40} height={40}/>
                                <p className="text-[#f7f9fa] text-[16px] font-medium font-poppins text-center">Shikoyatingiz muvaffaqiyatli yuborildi</p>
                                <button
                                    onClick={onClose}
                                    className="w-full h-[44px] rounded-[8px] bg-[#1c92e0] hover:bg-[#1a7fc7] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors"
                                >
                                    Yopish
                                </button>
                            </div>
                        ) : !category ? (
                            <div className="flex flex-col gap-[16px]">
                                {categories.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCategory(c)}
                                        className="w-full flex items-center justify-between gap-[8px] px-[16px] py-[19px] rounded-[8px] bg-[#15181a] border border-[#232627] hover:bg-[#232627] text-left transition-colors"
                                    >
                                        <span className="text-[#f7f9fa] text-[16px] font-medium font-poppins leading-[1]">{c.title}</span>
                                        <Image src="/icon-chevron-right-sm.svg" alt="" width={24} height={24} className="shrink-0"/>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-[8px]">
                                    <label className="text-[#9da1a3] text-[15px] font-medium font-poppins">Shikoyat turi</label>
                                    <div className="relative">
                                        <select
                                            value={category.id}
                                            onChange={e => setCategory(categories.find(c => c.id === Number(e.target.value)) ?? category)}
                                            className="w-full h-[44px] rounded-[8px] bg-[#13181c] border border-[#36393b] text-[#f7f9fa] text-[14px] font-poppins px-[12px] outline-none appearance-none"
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                        <Image src="/icon-chevron-down.svg" alt="" width={14} height={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[8px]">
                                    <label className="text-[#9da1a3] text-[15px] font-medium font-poppins">Shikoyat matni (ixtiyoriy)</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder={category.title}
                                        className="w-full rounded-[8px] bg-[#13181c] border border-[#36393b] text-[#f7f9fa] text-[14px] font-poppins px-[12px] py-[10px] outline-none resize-none placeholder:text-[#6F767E]"
                                    />
                                </div>

                                <div className="flex gap-[16px] mt-[8px]">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 h-[44px] rounded-[8px] bg-white/10 hover:bg-white/[0.15] text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="flex-1 h-[44px] rounded-[8px] bg-[#1c92e0] hover:bg-[#1a7fc7] disabled:opacity-50 text-[#f7f9fa] text-[16px] font-medium font-poppins transition-colors"
                                    >
                                        {submitting ? "Yuborilmoqda..." : "Yuborish"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
