"use client"
import axios from "axios";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Section from "@/app/common/components/Section";
import Anons from "@/app/common/components/Anons";
import BookItem from "@/app/common/components/Book/BookItem";
import Footer from "@/app/common/components/Footer/Footer";
import HeaderItem from "@/app/common/components/Header/Header";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default function NewsDetail({ params }: PageProps) {
    const router = useRouter();

    // 🔴 URL ichidagi ID ni Next.js 15+ standartida xavfsiz o'qib olamiz
    const resolvedParams = params && 'then' in params ? use(params) : params;
    const id = resolvedParams?.id;

    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ID hali yuklanmagan bo'lsa backendga so'rov ketmaydi
        if (!id) return;

        async function initNews() {
            try {
                setLoading(true);

                // 🔴 Backenddan bitta ID ga tegishli yangilikni olamiz
                const { data: responseData } = await axios.get(`${apiUrl}/public/news/${id}`);
                const newsData = responseData?.data || responseData;

                setNews(newsData);
            } catch (err) {
                console.error("Yangilikni yuklashda xatolik:", err);
            } finally {
                setLoading(false);
            }
        }

        initNews();
    }, [id]);

    // Sanani chiroyli formatlash funksiyasi
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('uz-UZ') + " " + date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <Section/>
            <div className="px-4 md:px-8 lg:px-12 py-20 text-center text-[#F7F9FA] font-poppins">Yangilik yuklanmoqda...</div>
            <Footer/>
        </div>
    );

    if (!news) return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <Section/>
            <div className="px-4 md:px-8 lg:px-12 py-20 text-center">
                <p className="text-[#F7F9FA] mb-4 font-poppins">Yangilik topilmadi.</p>
                <button onClick={() => router.push("/news")}
                        className="text-[#1498F3] text-[14px] cursor-pointer font-poppins bg-transparent border-none outline-none hover:underline">
                    Barcha yangiliklar sahifasiga qaytish
                </button>
            </div>
            <Footer/>
        </div>
    );

    const mainImage = news.image?.startsWith('http') ? news.image : `${apiUrl}/${news.image}`;

    return (
        <div className="bg-[#202020] min-h-screen text-white">
            <HeaderItem/>
            <Section/>
            <div className="px-4 md:px-8 lg:px-12 mt-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start mb-12">
                    <div className="w-full lg:flex-grow flex flex-col">
                        <article className="border border-[#1F272A] rounded-[12px] p-5 md:p-8 bg-[#1A1D1F]">

                            {/* Yangilik rasmi */}
                            {news.image && (
                                <div className="w-full h-[300px] md:h-[400px] rounded-[12px] overflow-hidden mb-6 bg-[#222]">
                                    <img src={mainImage} alt={news.title} className="w-full h-full object-cover"/>
                                </div>
                            )}

                            {/* Sanasi */}
                            <p className="text-[#9DA1A3] font-poppins text-[13px] mb-2">
                                {formatDate(news.createdAt || news.date)}
                            </p>

                            {/* Sarlavhasi */}
                            <h1 className="text-[#F7F9FA] font-poppins font-bold text-[28px] leading-[130%] mb-4">
                                {news.title}
                            </h1>

                            {/* To'liq matni */}
                            <div className="text-[#9DA1A3] font-poppins text-[15px] leading-[1.6] whitespace-pre-line border-t border-[#1F272A] pt-4">
                                {news.content || news.description || "Matn mavjud emas."}
                            </div>

                        </article>
                    </div>

                    {/* Yon panel (O'ng tarafdagi qism) */}
                    <aside className="w-full lg:w-[326px] shrink-0 flex flex-col gap-6">
                        <Anons/>
                        <BookItem/>
                    </aside>
                </div>
            </div>
            <Footer/>
        </div>
    );
}