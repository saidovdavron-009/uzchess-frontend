"use client"
import {useState} from "react";
import Image from "next/image";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    url: string;
}

function shareRow(url: string) {
    const encoded = encodeURIComponent(url);
    return [
        {name: "Instagram", icon: "/FooterImage/instagram.svg", href: "https://instagram.com"},
        {name: "Telegram", icon: "/FooterImage/telegram.svg", href: `https://t.me/share/url?url=${encoded}`},
        {name: "Twitter", icon: "/FooterImage/twitter.svg", href: `https://twitter.com/intent/tweet?url=${encoded}`},
        {name: "Facebook", icon: "/FooterImage/facebook 01.svg", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`},
    ];
}

export default function ShareModal({open, onClose, url}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    function copyLink() {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(12,13,15,0.94)]"
            onClick={onClose}
        >
            <div
                className="relative w-[378px] bg-[#1A1D1F] rounded-[12px] border border-[#1F272A] px-[24px] pt-[24px] pb-[24px]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-[24px] font-bold text-[#f7f9fa] font-poppins">Ulashish</h3>

                <div className="mt-[48px] h-[52px] rounded-[8px] bg-[#111315] flex items-center justify-center gap-[12px]">
                    {shareRow(url).map(s => (
                        <a
                            key={s.name}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:opacity-80 transition-opacity"
                        >
                            <Image src={s.icon} alt={s.name} width={24} height={24}/>
                        </a>
                    ))}
                </div>

                <div className="mt-[12px] h-[53px] rounded-[8px] bg-[#111315] flex items-center justify-between pl-[16px]">
                    <span className="text-[16px] font-medium text-[#9DA1A3] font-poppins truncate">{url}</span>
                    <button
                        onClick={copyLink}
                        className="w-[45px] h-[45px] shrink-0 rounded-[8px] bg-[#F7F9FA] flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="Nusxalash"
                    >
                        <Image src="/copy-icon.svg" alt="" width={24} height={24} className="brightness-0"/>
                    </button>
                </div>

                {copied && (
                    <p className="mt-[8px] text-[13px] text-[#82CC27] font-poppins text-center">Havola nusxalandi!</p>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-0 left-[390px] w-[40px] h-[40px] rounded-[8px] bg-[#1a1d1f] hover:bg-[#232627] flex items-center justify-center transition-colors"
                    aria-label="Yopish"
                >
                    <Image src="/close-x.svg" alt="" width={18} height={18}/>
                </button>
            </div>
        </div>
    );
}