"use client"
import Image from "next/image";

export default function Section() {

    return <div className="flex gap-2 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
        <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
        <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
        <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
        <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Yangiliklar</h4>
    </div>
}