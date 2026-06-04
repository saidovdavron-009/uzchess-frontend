"use client"
import NewsItem from "@/app/news/components/NewsItem";
import {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";


interface NewsType {
    id: number;
    title: string;
    date: string;
    image: string;
    content: string;
}

const STEP = 12;
export default function NewsItemContainer({search}: { search: string }) {

    const [news, setNews] = useState<NewsType[]>([]);
    const [shown, setShown] = useState(STEP);


    useEffect(() => {
        async function getAllNews() {
            const response = await axios.get(`http://localhost:3000/public/news?search=${search}`);
            console.log(response.data)
            setNews(response.data.data);
        }

        getAllNews();
    }, [search]); // dependency array

    const loadMore = () => {
        setShown((prev) => prev + STEP);
    };

    return <div className="flex flex-col mt-[26px] w-[1026px]">
        <div className="flex flex-wrap gap-5">
            {news.length > 0 ? (
                news.slice(0, shown).map((item) => (
                    <NewsItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        date={item.date}
                        image={item.image}
                        content={item.content}
                    />
                ))
            ) : (
                <div
                    className="flex flex-col w-[1000px] items-center justify-center py-16 bg-[#202020] rounded-[12px]">
                    <Image src="/notfoundcourse.svg" alt="" className="w-[200px] h-[180px] mb-4" width={200} height={180}/>
                    <p className="text-[#F7F9FA] font-poppins text-[16px] font-medium">Hech qanday ma'lumot topilmadi</p>
                </div>
            )}
        </div>
        {shown < news.length && (
            <button
                onClick={loadMore}
                className="ml-[450px] w-[131px] h-[40px] mt-[20px] bg-[#1A1D1F] rounded-[8px] text-white]"
            >
                Ko'proq
            </button>
        )}
    </div>
}