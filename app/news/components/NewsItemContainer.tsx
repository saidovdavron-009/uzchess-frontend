"use client"
import NewsItem from "@/app/news/components/NewsItem";
import {useEffect, useState} from "react";
import axios from "axios";

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
            {news.slice(0, shown).map((item) => (
                <NewsItem
                    key={item.id}
                    title={item.title}
                    date={item.date}
                    image={item.image}
                    content={item.content}
                />
            ))}
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