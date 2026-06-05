'use client';
import axios from "axios";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Section from "@/app/common/components/Section";
import Anons from "@/app/common/components/Anons";
import BookItem from "@/app/common/components/Book/BookItem";
import Footer from "@/app/common/components/Footer/Footer";
import HeaderItem from "@/app/common/components/Header/Header";
import Image from "next/image"; // Header'ni ham qo'shib qo'ydim

interface NewsItemData {
    id: number;
    date: string;
    title: string;
    content: string;
    image: string;
}

// Portni asosiy sahifadagidek 3000 deb belgilaymiz
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day} ${month}, ${year} • ${hours}:${minutes}`;
    } catch {
        return dateStr;
    }
}

export default function NewsDetail() {
    const router = useRouter();
    const {id} = useParams();
    const [news, setNews] = useState<NewsItemData | null>(null);
    const [similar, setSimilar] = useState<NewsItemData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setLoading(true);

                const response = await axios.get(`${apiUrl}/public/news`);

                const allList: NewsItemData[] = response.data?.data || response.data;

                if (Array.isArray(allList)) {
                    const found = allList.find((n) => n.id === Number(id));

                    if (found) {
                        setNews(found);
                        setSimilar(allList.filter((n) => n.id !== Number(id)).slice(0, 3));
                    } else {
                        setNews(null);
                    }
                } else {
                    setNews(null);
                }
            } catch (error) {
                console.error("Yangilikni yuklashda xatolik:", error);
                setNews(null);
            }
            {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <div className="container py-32 text-center text-[#F7F9FA] text-[18px]">
                Yangilik yuklanmoqda...
            </div>
            <Footer/>
        </div>
    );

    if (!news) return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <Section/>
            <div className="container py-32 text-center">
                <p className="text-[#F7F9FA] mb-4 text-[18px]">Yangilik topilmadi.</p>
                <button
                    onClick={() => router.push("/news")}
                    className="text-[#1498F3] text-[16px] font-medium cursor-pointer bg-transparent border-none outline-none hover:underline"
                >
                    Barcha yangiliklarga qaytish
                </button>
            </div>
            <Footer/>
        </div>
    );

    const imageSrc = news.image?.startsWith('http') ? news.image : `${apiUrl}/${news.image}`;

    return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <div className="flex gap-3 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Kutubxona</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 ml-[30px] mb-[2px]"/>
                <h4 className=" h-[18px] text-white font-medium mb-1">{news.title}</h4>
            </div>
            <div className="px-4 md:px-8 lg:px-12 mt-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full lg:flex-grow">
                        <article className="bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] p-5 md:p-8">
                            <h1 className="text-[#F7F9FA] font-sans font-bold text-[28px] leading-[130%] mb-3">{news.title}</h1>
                            <p className="text-[#F7F9FA66] text-[14px] font-sans mb-6">{formatDate(news.date)}</p>

                            <img
                                src={imageSrc}
                                alt={news.title}
                                className="w-full rounded-[12px] mb-8 max-h-[420px] object-cover"
                            />

                            {news.content && (
                                <div className="mt-2">
                                    {news.content.split('\n\n').map((para, idx) => (
                                        <p key={idx} className="text-[#9DA1A3] text-[15px] leading-[1.8] mb-5">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div
                                className="flex flex-wrap justify-between items-center gap-4 border-t border-b border-[#1F272A] py-4 mt-8">
                                <div className="flex items-center gap-4">
                                    {["/twitter.svg", "/facebook 01.svg", "/telegram.svg", "/log-in.svg"].map((s) => (
                                        <button key={s}
                                                className="opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-none">
                                            <img src={s} alt="" className="h-[18px]"/>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-[#9DA1A3] text-[13px]">
                                    <button
                                        className="flex items-center gap-1.5 bg-[#0D0F10] border border-[#1F272A] hover:bg-[#262A2D] text-white px-3 py-1.5 rounded-[8px] text-[12px] cursor-pointer">
                                        <span>Поделиться</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M8.684 10.742l4.628-2.2a3 3 0 11.83 1.666l-4.628 2.2a3 3 0 01-.83-1.666zM13.316 13.258l-4.628 2.2a3 3 0 10.83 1.666l4.628-2.2a3 3 0 00-.83-1.666z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </article>

                        {similar.length > 0 && (
                            <div className="mt-8 mb-12">
                                <div className="flex justify-between items-center mb-5">
                                    <h2 className="text-[18px] font-bold font-sans text-[#FCFCFC]">O'xshash
                                        yangiliklar</h2>
                                    <button
                                        onClick={() => router.push("/news")}
                                        className="text-[#9DA1A3] hover:text-white text-[13px] flex items-center gap-1 cursor-pointer bg-transparent border-none"
                                    >
                                        Barcha yangiliklar
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {similar.map((item) => {
                                        const simImg = item.image?.startsWith('http') ? item.image : `${apiUrl}/${item.image}`;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => router.push(`/news/${item.id}`)}
                                                className="bg-[#1A1D1F] border border-[#1F272A] rounded-[10px] p-4 cursor-pointer hover:border-[#1C92E0] transition-all"
                                            >
                                                <img src={simImg} alt=""
                                                     className="w-full h-[120px] object-cover rounded-[6px] mb-3"/>
                                                <p className="text-[12px] text-[#F7F9FA66] mb-2 font-sans">{formatDate(item.date)}</p>
                                                <h3 className="text-[#F7F9FA] text-[13px] font-semibold font-sans line-clamp-2 mb-2">{item.title}</h3>
                                                <p className="text-[#9DA1A3] text-[12px] line-clamp-2">{item.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-[326px] shrink-0 flex flex-col gap-6 mt-[-20px]">
                        <BookItem/>
                    </aside>
                </div>
            </div>
            <Footer/>
        </div>
    );
}