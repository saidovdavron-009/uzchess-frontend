"use client"
import HeaderItem from "@/app/common/components/Header/Header";
import Section from "@/app/common/components/Section";
import BookItem from "@/app/common/components/Book/BookItem";
import Footer from "@/app/common/components/Footer/Footer";
import NewsItemContainer from "@/app/news/components/NewsItemContainer";
import {useState} from "react";

export default function Page() {

    const [search, setSearch] = useState("")

    return <div className="bg-[#202020]">
        <HeaderItem/>
        <Section/>
        <div className="w-[1030px] h-[52px] flex items-center mt-5 justify-between ml-[30px]">
            <h1 className="w-[180px] h-[42px] font-bold text-[32px] text-white">Yangiliklar</h1>
            <input
                type="text"
                placeholder="⌕ Izlash"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#15181A] w-[326px] h-[52px] text-white rounded-[8px] px-[16px] py-[4px] outline-none border-[#232627] border-[1px]"
            />
        </div>
        <div className="flex ml-[50px] gap-10">
            <NewsItemContainer search={search}/>
            <BookItem/>
        </div>
        <Footer/>
    </div>
}