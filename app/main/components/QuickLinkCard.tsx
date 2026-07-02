"use client"
import Image from "next/image";

interface QuickLinkCardProps {
    label: string;
    iconGlowSrc: string;
    watermarkSrc: string;
    watermarkWidth: number;
    watermarkHeight: number;
    watermarkPosCls: string;
    onClick?: () => void;
}

export default function QuickLinkCard({
                                            label,
                                            iconGlowSrc,
                                            watermarkSrc,
                                            watermarkWidth,
                                            watermarkHeight,
                                            watermarkPosCls,
                                            onClick
                                        }: QuickLinkCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative w-[326px] h-[108px] rounded-[8px] border-[1.6px] border-[#1C92E0] bg-[#1A1D1F] overflow-hidden cursor-pointer transition-colors hover:bg-[#13181C] hover:shadow-[0_8px_44px_rgba(28,146,224,0.2)]">
            <div className="absolute rounded-full bg-[#1C92E0] blur-[62px] w-[140px] h-[140px] top-[-86px] left-[260px]"/>
            <div className="absolute rounded-full bg-[#1C92E0] blur-[62px] w-[140px] h-[140px] top-[67px] left-[-111px]"/>
            <Image src={watermarkSrc} alt="" width={watermarkWidth} height={watermarkHeight}
                   className={`absolute mix-blend-overlay ${watermarkPosCls}`}/>

            <div className="absolute inset-0 flex items-center justify-center gap-4">
                <div className="relative w-11 h-11 shrink-0">
                    <Image src={iconGlowSrc} alt="" width={204} height={204}
                           className="absolute -top-20 -left-20 w-[204px] h-[204px] max-w-none"/>
                </div>
                <span
                    className="text-[20px] font-medium text-[#EFEFEF] leading-[20px] group-hover:font-bold group-hover:text-[#F7F9FA]">
                    {label}
                </span>
            </div>
        </div>
    );
}