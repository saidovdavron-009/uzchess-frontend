"use client"
import Image from "next/image";

interface GameOfDayProps {
    image?: string;
    time: string;
    gameType: string;
    whitePlayer: string;
    blackPlayer: string;
    onWatch?: () => void;
}

export default function GameOfDay({image, time, gameType, whitePlayer, blackPlayer, onWatch}: GameOfDayProps) {
    return (
        <div className="w-[326px] h-[309px] bg-[#272B30] rounded-[8px] border-[#1F272A] border-[1px] font-poppins overflow-hidden">
            <div className="h-[58px] px-4 flex items-center justify-between">
                <h3 className="text-[20px] font-medium text-[#FCFCFC] leading-[26px]">Kun o'yini</h3>
                <button
                    onClick={onWatch}
                    className="flex items-center gap-1 text-[#9DA1A3] text-[16px] leading-[24px] cursor-pointer hover:text-[#1C92E0]">
                    Ko'rish
                    <Image src="/chevron-right.svg" alt="" width={20} height={20}/>
                </button>
            </div>

            <div className="relative w-full h-[183px] overflow-hidden cursor-pointer" onClick={onWatch}>
                {image && <Image src={image} alt="Kun o'yini" fill className="object-cover"/>}
                <div className="absolute inset-0 bg-[#091013]/64"/>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image src="/play.svg" alt="" width={56} height={56}/>
                </div>

                <div
                    className="absolute bottom-0 left-0 w-full h-[44px] px-4 flex items-center justify-between bg-[#1A1D1F]/40 border-t border-t-[#FFFFFF33] backdrop-blur-[8px]">
                    <span className="text-[14px] text-[#FCFCFC] leading-[21px]">{time}</span>
                    <div className="flex items-center gap-1">
                        <Image src="/Frame.svg" alt="" width={20} height={20}/>
                        <span className="text-[14px] font-medium text-[#82CC27] leading-[18px]">{gameType}</span>
                    </div>
                </div>
            </div>

            <div className="h-[68px] bg-[#1A1D1F] flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative w-5 h-9 shrink-0">
                        <Image src="/like-badge.svg" alt="like" width={68} height={84}
                               className="absolute -top-6 -left-6 w-[68px] h-[84px] max-w-none"/>
                    </div>
                    <span className="max-w-[95px] text-[14px] font-medium text-[#F7F9FA] leading-[21px] break-words">{whitePlayer}</span>
                </div>
                <Image src="/vs.svg" alt="vs" width={32} height={32} className="shrink-0"/>
                <div className="flex items-center gap-2">
                    <span className="max-w-[95px] text-[14px] font-medium text-[#FCFCFC] leading-[21px] text-right break-words">{blackPlayer}</span>
                    <Image src="/dislike-badge.svg" alt="dislike" width={20} height={36} className="shrink-0"/>
                </div>
            </div>
        </div>
    );
}