"use client"
import {useState} from "react";
import HeaderItem from "@/app/common/components/Header/Header";
import Section from "@/app/common/components/Section";
import BookFilters from "@/app/book/components/BookFilters";
import BookItemContainer from "@/app/book/components/BookItemContainer";
import YoshlarAgencyPoster from "@/app/common/components/yoshlar-agency-poster";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";

export default function BookPages() {
    const [search, setSearch] = useState("")
    return <div className="flex flex-col">
        <HeaderItem/>
        <div className="flex gap-2 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
            <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
            <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
            <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
            <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Kutubxona</h4>
        </div>
        <div className="flex w-full h-full gap-[24px] mt-5">
            <div className="flex flex-col gap-[24px]">
                <div
                    className="ml-[32px] w-[326px] h-[100px] flex gap-3 items-center bg-[#1A1D1F] rounded-lg border-[#232627] border-[2px]">
                    <Image src="/books.svg" alt="eduIcon" className="object-cover ml-[54px]" width={70} height={44}/>
                    <h1 className="w-[121px] h-[42px] text-[32px] font-bold mb-[12px]">Kutubxona</h1>
                </div>
                <BookFilters/>
            </div>
            <div className="ml-[10px]">
                <input type="text"
                       placeholder="🔎︎ Izlash"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="w-[676px] h-[52px] py-[14px] px-[16px] bg-[#15181A] rounded-[8px] border-[#232627] border-[2px] outline-none"/>
                <BookItemContainer search={search}/>
            </div>
            <YoshlarAgencyPoster/>
        </div>
        <Footer/>
    </div>
}