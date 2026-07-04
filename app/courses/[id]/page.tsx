"use client"
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";
import {useEffect, useState} from "react";
import CourseAccordion from "@/app/courses/components/Accardion";
import Anons from "@/app/common/components/Anons";
import axios from "axios";
import {useParams} from "next/navigation";
import CourseComments from "@/app/news/components/CourseIzoh";
import ContinueWatchingCard from "@/app/courses/components/ContinueWatchingCard";
import {getToken} from "@/app/common/components/Auth/authApi";
import {toggleCourseLike, fetchLikedCourseIds} from "@/app/common/api/likeApi";
import PurchaseModal from "@/app/courses/components/PurchaseModal";
import ShareModal from "@/app/courses/components/ShareModal";
import {resolveImageUrl} from "@/app/common/utils/imageUrl";
import {checkCoursePurchased} from "@/app/courses/utils/lessonHelpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getUserIdFromToken(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        return decoded.id ?? null;
    } catch {
        return null;
    }
}

async function savePurchase(courseId: number, token: string): Promise<void> {
    const userId = getUserIdFromToken(token);
    if (!userId) return;
    await axios.post(`${API_URL}/admin/purchasedCourse`, {
        userId,
        courseId,
        isCompleted: false,
        date: new Date().toISOString(),
    }, {headers: {Authorization: `Bearer ${token}`}});
}

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
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

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

    useEffect(() => {
        const token = getToken() ?? "";
        if (!token || !id) return;
        fetchLikedCourseIds(token).then(ids => setLiked(ids.has(Number(id))));
        checkCoursePurchased(Number(id), token).then(setPurchased);
    }, [id]);

    async function handleToggleLike() {
        const token = getToken() ?? "";
        if (!token || !id) return;
        try { await toggleCourseLike(token, Number(id)); } catch {}
        setLiked(prev => !prev);
    }

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
            <div className="flex gap-3 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Kurslar</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8}
                       className="w-2 h-2 mt-2 ml-[4px] mb-[2px]"/>
                <h4 className=" h-[18px] text-white font-medium mb-1">{course.title}</h4>
            </div>

            <div className="w-full mt-[15px] px-[40px]">
                <div
                    className="relative w-full min-h-[194px] rounded-xl overflow-hidden bg-[#0B141800] border border-slate-800 p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    <img
                        src={resolveImageUrl(course.image)}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 z-0 pointer-events-none"
                    />
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div>
                            <h1 className="text-[32px] font-bold text-white mb-[8px] leading-tight">
                                {course.title}
                            </h1>
                            <div className="flex gap-3 items-center text-white">
                                <Image src="/pul.png" alt="narx" width={24} height={24}/>
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
                                <Image src={resolveImageUrl(course.difficulty.icon)} alt="daraja" width={13}
                                       height={17}/>
                                <p className="font-normal text-[14px]">{course.difficulty.title}</p>
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

                    <div
                        className="relative z-10 flex flex-col items-end justify-between h-full self-stretch space-y-4 md:space-y-0 min-w-[370px]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg self-end">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Image key={i} src={i < Math.floor(rating) ? "/icon-star-filled.svg" : "/icon-star-outline.svg"} alt="" width={14} height={14}/>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-white">{course.rating}</span>
                            <span className="text-[11px] text-slate-500">({course.reviewsCount} ta izoh)</span>
                        </div>

                        <div className="flex gap-[12px] w-full justify-end mt-[50px]">
                            {purchased ? (
                                <div className="w-[220px] h-[50px] rounded-[8px] flex items-center justify-center gap-[8px]">
                                    <Image src="/icon-check-green.svg" alt="" width={16} height={16}/>
                                    <span className="text-[#82CC27] text-[16px] font-medium font-poppins">Sotib olingan</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setPurchaseOpen(true)}
                                    className="bg-[#1C92E0] hover:bg-[#177db3] w-[220px] h-[50px] rounded-[8px] px-[20px] flex gap-[10px] items-center justify-center font-medium text-[16px] text-white transition-all whitespace-nowrap">
                                    Kursni sotib olish
                                </button>
                            )}
                            <button
                                onClick={handleToggleLike}
                                className="w-[50px] h-[50px] rounded-[8px] bg-[#14213d]/60 border-[#F7F9FA33] border-[1px] flex items-center justify-center hover:bg-[#1d2d50] transition-colors">
                                <Image src={liked ? "/red-heart.svg" : "/likes.svg"} alt="like" width={22} height={20}/>
                            </button>
                            <button
                                onClick={() => setShareOpen(true)}
                                className="w-[50px] h-[50px] rounded-[8px] bg-[#14213d]/60 border-[#F7F9FA33] border-[1px] flex items-center justify-center hover:bg-[#1d2d50] transition-colors active:scale-95">
                                <Image src="/share.svg" alt="share icon" width={18} height={18}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex mt-[50px]">
                    <div className="flex-1 gap-20">
                        <CourseAccordion courseId={Number(id)} purchased={purchased} onRequestPurchase={() => setPurchaseOpen(true)}/>
                        <div className="h-[64px]"></div>
                        <CourseComments courseId={Number(id)}/>
                    </div>
                    <div className="flex flex-col items-center gap-6 w-[370px]">
                        <Anons/>
                        <ContinueWatchingCard courseId={Number(id)}/>
                    </div>
                </div>
            </div>
            <Footer/>
            <PurchaseModal
                open={purchaseOpen}
                onClose={() => setPurchaseOpen(false)}
                courseTitle={course?.title ?? ""}
                price={course?.newPrice ?? course?.price ?? "0"}
                onPurchased={() => {
                    setPurchased(true);
                    const token = getToken() ?? "";
                    if (token && id) savePurchase(Number(id), token).catch(() => {});
                }}
            />
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                url={typeof window !== "undefined" ? window.location.href : ""}
            />
        </>
    );
}