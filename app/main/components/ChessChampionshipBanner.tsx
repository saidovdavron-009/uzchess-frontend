"use client"
import Image from "next/image";

export default function ChessChampionshipBanner() {
    return (
        <div className="relative w-[676px] h-[88px] rounded-[8px] overflow-hidden bg-[#1A1D1F]">
            <Image src="/image%20220.png" alt="2022 Chess.com Global Championship" fill sizes="676px" priority className="object-cover"/>
            <div className="absolute top-0 left-[415px] w-[261px] h-full bg-[#0481B9]"/>
            <button
                className="absolute top-[24px] left-[496px] w-[102px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#0A2041] border border-[#F7F9FA]/[0.08] shadow-[0_4px_44px_0_rgba(10,32,65,0.88)] font-poppins font-medium text-[16px] leading-[20.8px] text-[#FCFCFC] cursor-pointer">
                Ko‘rish
            </button>
        </div>
    );
}