"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ReviewUser {
    id?: number;
    fullName?: string;
    name?: string;
    image?: string;
    avatar?: string;
}

interface ReviewRaw {
    id: number;
    userId?: ReviewUser | number;
    fullName?: string;
    userImage?: string;
    courseId?: number;
    rating?: number;
    comment?: string;
    text?: string;
    createdAt?: string;
    date?: string;
    user?: ReviewUser;
}

interface Comment {
    id: number;
    author: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
}

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year} y. ${hours}:${mins}`;
    } catch {
        return dateStr;
    }
}

function mapReview(r: ReviewRaw): Comment {
    const userObj = typeof r.userId === "object" ? r.userId : (r.user ?? null);
    const fullName = userObj?.fullName ?? userObj?.name ?? r.fullName ?? "Foydalanuvchi";
    const rawImage = userObj?.image ?? userObj?.avatar ?? r.userImage ?? "";
    const avatar = rawImage
        ? (rawImage.startsWith("http") ? rawImage : `${API_URL}/${rawImage}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1A1D1F&color=9DA1A3`;
    return {
        id: r.id,
        author: fullName,
        avatar,
        date: formatDate(r.createdAt ?? r.date ?? ""),
        rating: r.rating ?? 0,
        text: r.comment ?? r.text ?? "",
    };
}

async function fetchReviews(courseId: number): Promise<ReviewRaw[]> {
    try {
        const {data} = await axios.get(`${API_URL}/public/courseReviews?size=500`);
        const all: ReviewRaw[] = Array.isArray(data) ? data : (data?.data ?? []);
        return all.filter(r => Number(r.courseId) === courseId);
    } catch {
        return [];
    }
}

export default function CourseComments({courseId}: { courseId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeReportId, setActiveReportId] = useState<number | null>(null);

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        fetchReviews(courseId).then(list => {
            setComments(list.map(mapReview));
            setLoading(false);
        });
    }, [courseId]);

    if (loading || comments.length === 0) return null;

    return (
        <div className="w-full font-sans text-white">
            <h2 className="text-[28px] font-bold mb-[13px]">Kurs haqida izohlar</h2>

            <div className="flex flex-col gap-6 bg-[#1A1D1F] p-[20px] border border-[#1F272A] rounded-[12px]">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="relative flex gap-4 pb-6 border-b border-[#2C2F31]/40 last:border-none"
                    >
                        <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0">
                            <img
                                src={comment.avatar}
                                alt={comment.author}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-2 pr-8 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="font-semibold text-[15px] text-[#f0f4f8]">
                                    {comment.author}
                                </span>
                            </div>
                            <div className="flex gap-5">
                                <span className="text-[12px] text-[#9DA1A3]">{comment.date}</span>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, index) => (
                                        <Image
                                            key={index}
                                            src={index < comment.rating ? "/icon-star-filled.svg" : "/icon-star-outline.svg"}
                                            alt=""
                                            width={14}
                                            height={14}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[14px] leading-[22px] text-[#D0DCE8] font-normal mt-1 ml-[-60px]">
                                {comment.text}
                            </p>
                        </div>

                        <div className="absolute right-0 top-0">
                            <button
                                onClick={() => setActiveReportId(activeReportId === comment.id ? null : comment.id)}
                                className="p-1 text-[#9DA1A3] hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <Image src="/icon-dots-vertical.svg" alt="" width={20} height={20}/>
                            </button>

                            {activeReportId === comment.id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveReportId(null)}/>
                                    <div
                                        className="absolute right-0 mt-2 z-20 bg-[#1A1D1F] border border-[#2C2F31] rounded-[6px] shadow-2xl p-[10px] w-[140px] flex items-center gap-2 cursor-pointer hover:bg-white/[0.03] transition-colors select-none">
                                        <Image src="/icon-warning.svg" alt="" width={14} height={14}/>
                                        <span className="text-[13px] font-medium text-[#D0DCE8]">Shikoyat qilish</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-center mt-8">
                <button
                    className="px-6 py-[10px] border border-[#2C2F31] bg-transparent rounded-[6px] text-[14px] font-medium text-[#D0DCE8] hover:bg-white/5 hover:text-white transition-all">
                    Barcha izohlar
                </button>
            </div>
        </div>
    );
}
