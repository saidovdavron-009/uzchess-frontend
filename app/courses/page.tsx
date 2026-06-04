"use client"
import {useState} from "react";
import HeaderItem from "@/app/common/components/Header/Header";
import Section from "@/app/common/components/Section";
import CourseFilters from "@/app/courses/components/CourseFilters";
import CourseItemContainer from "@/app/courses/components/CourseItemContainer";
import DonationsBanner from "@/app/common/components/donationsBanner";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";

export default function Page() {
    const [search, setSearch] = useState("")
    return <div className="flex flex-col">
        <HeaderItem/>
        <Section/>
        <div className="flex w-full h-full gap-[24px] mt-5">
            <div className="flex flex-col gap-[24px]">
                <div
                    className="ml-[32px] w-[326px] h-[100px] flex justify-center gap-3 items-center bg-[#1A1D1F] rounded-lg border-[#232627] border-[2px]">
                    <Image src="/Vector1.svg" alt="eduIcon" className="object-cover w-[70px] h-[44px]" width={70} height={44}/>
                    <h1 className="w-[121px] h-[42px] text-[32px] font-bold mb-[12px]">Kurslar</h1>
                </div>
                <CourseFilters/>
            </div>
            <div className="ml-[10px]">
                <input type="text"
                       placeholder="🔎︎ Izlash"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="w-[676px] h-[52px] py-[14px] px-[16px] bg-[#15181A] rounded-[8px] border-[#232627] border-[2px] outline-none"/>
                <CourseItemContainer search={search}/>
            </div>
            <DonationsBanner/>
        </div>
        <Footer/>
    </div>
}