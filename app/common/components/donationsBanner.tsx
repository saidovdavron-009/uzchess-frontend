"use client"
import Anons from "@/app/common/components/Anons";
import Image from "next/image";

export default function DonationsBanner() {
    return <div className="flex flex-col items-center gap-6 w-[370px]">
        <Anons/>
        <div
            className="w-[326px] h-[82px] flex items-center p-[20px] bg-[#1A1D1F] ml-[20px] border-[1px] border-[#232627] rounded-[8px]">
            <Image src="/Icon%20charity.svg" alt="icons" className="w-[42px] h-[42px] object-cover" width={42} height={42}/>
            <div className="w-full">
                <h1 className="w-[158px] h-[24px] font-normal text-[16px]">Loyiha rivojiga xissa</h1>
                <h4 className="w-[221px] h-[21px] text-[14px] text-[#6F767E] font-normal">Shaxmat rivojiga hissa qo'shing</h4>
            </div>
            <h1 className="mb-[15px] bg-[#1C92E0] text-center text-[12px] font-medium rounded-[4px]">soon</h1>
        </div>
    </div>
}