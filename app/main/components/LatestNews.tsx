"use client"
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

interface NewsType {
    id: number;
    title: string;
    date: string;
    image: string;
    content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const UZ_MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

function formatDate(date: string) {
    const d = new Date(date);
    return `${UZ_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function LatestNews() {
    const [news, setNews] = useState<NewsType[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function getNews() {
            const response = await axios.get(`${API_URL}/public/news`);
            setNews(response.data.data.slice(0, 4));
        }

        getNews();
    }, []);

    return (
        <div className="w-[676px]">
            <div className="flex items-center justify-between">
                <h1 className="font-poppins font-bold text-[20px] leading-[26px] text-[#FCFCFC]">Yangiliklar</h1>
                <Link href="/news"
                      className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity select-none">
                    <span className="font-poppins text-[16px] text-[#9DA1A3]">Barchasi</span>
                    <Image src="/chevron-right.svg" alt="barchasi" width={20} height={20}/>
                </Link>
            </div>

            <div className="mt-5 flex flex-col">
                {news.map((item, index) => (
                    <div key={item.id}>
                        <div
                            onClick={() => router.push(`/news/${item.id}`)}
                            className="group relative flex items-center gap-4 h-[120px] cursor-pointer"
                        >
                            <Image src={item.image} alt={item.title} width={180} height={120}
                                   className="w-[180px] h-[120px] rounded-[8px] object-cover shrink-0"/>
                            <div className="w-[480px] h-[140px] mt-[20px]">
                                <div className="flex justify-between h-[20px]">
                                    <p className="font-poppins text-[14px] text-white">{formatDate(item.date)}</p>
                                    <Image src="/arrow-right.svg" alt="" width={24} height={24}
                                           className="-translate-y-1/2 opacity-0 group-hover:opacity-100 object-cover transition-opacity mt-[10px]"/>
                                </div>
                                <h4 className="mt-2 font-inter font-semibold text-[16px] leading-[20.8px] text-white line-clamp-2 group-hover:text-[#1C92E0] transition-colors">
                                    {item.title}
                                </h4>
                                <p className="mt-2 font-inter font-medium text-[14px] leading-[18.2px] text-[#888888] line-clamp-2">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                        {index < news.length - 1 && <div className="my-5 h-px w-full bg-[#272B30]"/>}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Link href="/news"
                      className="w-[131px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#1A1D1F] text-[#EFEFEF] font-poppins font-medium text-[16px] hover:opacity-80 transition-opacity">
                    Ko‘proq
                </Link>
            </div>
        </div>
    );
}