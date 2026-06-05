"use client"
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import Section from "@/app/common/components/Section";
import Image from "next/image";
import {useEffect, useState} from "react";
import CourseAccordion from "@/app/courses/components/Accardion";
import Anons from "@/app/common/components/Anons";
import axios from "axios";
import {useParams} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Course {
    id: any;
    title: string;
    price: string;
    newPrice: string;
    rating: string;
    reviewsCount: number;
    sectionsCount: number;
    lessonsCount: number;
    image: string;
    author: { id: number; fullName: string };
    category: { id: number; title: string };
    language: { id: number; title: string; code: string };
    difficulty: { id: number; title: string; icon: string };
}

export default function Page() {
    const {id} = useParams();
    const [liked, setLiked] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCourse() {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/public/courses/${id}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Kurs yuklanmadi:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) getCourse();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col min-h-screen">
            <HeaderItem/>
            <div className="flex-1 flex items-center justify-center">
                <p className="text-white font-poppins text-[18px]">Yuklanmoqda...</p>
            </div>
            <Footer/>
        </div>
    );

    if (!course) return (
        <div className="flex flex-col min-h-screen">
            <HeaderItem/>
            <div className="flex-1 flex items-center justify-center">
                <p className="text-red-400 font-poppins text-[18px]">Kurs topilmadi.</p>
            </div>
            <Footer/>
        </div>
    );

    const price = Number(course.price);
    const newPrice = Number(course.newPrice);
    const rating = Number(course.rating);

    return (
        <>
            <HeaderItem/>
            <Section/>

            <div className="w-full mt-[15px] px-[40px]">
                {/* Banner */}
                <div className="relative w-full min-h-[194px] rounded-xl overflow-hidden bg-[#0d1527] border border-slate-800 p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    <img
                        src={`http://localhost:3000/${course.image}`}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 z-0 pointer-events-none"
                    />
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div>
                            <h1 className="text-[32px] font-bold text-white mb-[8px] leading-tight">
                                {course.title}
                            </h1>
                            <div className="flex gap-3 items-center text-white">
                                <Image src="/cash-outline 1.svg" alt="narx" width={24} height={24}/>
                                <h3 className="text-[20px] font-bold">
                                    {newPrice > 0 ? newPrice.toLocaleString() : price.toLocaleString()} uzs
                                </h3>
                                {newPrice > 0 && newPrice < price && (
                                    <p className="line-through decoration-[#DC2D2DCC] font-normal text-[14px] text-[#F7F9FAA3]">
                                        {price.toLocaleString()} uzs
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-[24px] text-[#F7F9FAC7]">
                            <div className="flex gap-[8px] items-center">
                                {/*<Image src={course.difficulty.icon} alt="daraja" width={13} height={17}/>*/}
                                {/*<p className="font-normal text-[14px]">{course.difficulty?.title || "—"}</p>*/}
                            </div>
                            <div className="flex gap-[8px] items-center">
                                <Image src="/section.svg" alt="bo'lim" width={18} height={18}/>
                                <p className="font-normal text-[14px]">{course.sectionsCount} ta bo'lim</p>
                            </div>
                            <div className="flex gap-[8px] items-center">
                                <Image src="/vidioIcon.svg" alt="dars" width={13} height={17}/>
                                <p className="font-normal text-[14px]">{course.lessonsCount} ta dars</p>
                            </div>
                        </div>
                    </div>

                    {/* O'ng qism */}
                    <div className="relative z-10 flex flex-col items-end justify-between h-full self-stretch space-y-4 md:space-y-0 min-w-[370px]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg self-end">
                            <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    i < Math.floor(rating) ? (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                        </svg>
                                    ) : (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                        </svg>
                                    )
                                ))}
                            </div>
                            <span className="text-sm font-bold text-white">{course.rating}</span>
                            <span className="text-[11px] text-slate-500">({course.reviewsCount} ta izoh)</span>
                        </div>

                        <div className="flex gap-[12px] w-full justify-end mt-[50px]">
                            <button className="bg-[#1C92E0] hover:bg-[#177db3] w-[220px] h-[50px] rounded-[8px] px-[20px] flex gap-[10px] items-center justify-center font-medium text-[16px] text-white transition-all whitespace-nowrap">
                                Kursni sotib olish
                            </button>
                            <button
                                onClick={() => setLiked(!liked)}
                                className="w-[50px] h-[50px] rounded-[8px] bg-[#14213d]/60 border-[#F7F9FA33] border-[1px] flex items-center justify-center hover:bg-[#1d2d50] transition-colors">
                                {liked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e25555">
                                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                        <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572"/>
                                    </svg>
                                )}
                            </button>
                            <button className="w-[50px] h-[50px] rounded-[8px] bg-[#14213d]/60 border-[#F7F9FA33] border-[1px] flex items-center justify-center hover:bg-[#1d2d50] transition-colors active:scale-95">
                                <Image src="/share.svg" alt="share icon" width={18} height={18}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Accordion va Anons */}
                <div className="flex justify-between mt-[50px] gap-[24px]">
                    <div className="flex-1 min-w-0">
                        <CourseAccordion/>
                    </div>
                    <div className="w-[326px] shrink-0">
                        <Anons/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}