"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";
import ReportModal from "@/app/common/components/ReportModal";

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
    avatar: string | null;
    initials: string;
    date: string;
    rating: number;
    text: string;
}

function initialsOf(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

async function fetchUserById(userId: number): Promise<ReviewUser | null> {
    try {
        const {data} = await axios.get(`${API_URL}/admin/users/${userId}`);
        return {id: data.id, fullName: data.fullName, image: data.profileImage};
    } catch {
        return null;
    }
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

function mapReview(r: ReviewRaw, resolvedUser: ReviewUser | null): Comment {
    const userObj = (typeof r.userId === "object" ? r.userId : (r.user ?? resolvedUser)) ?? null;
    const fullName = userObj?.fullName ?? userObj?.name ?? r.fullName ?? "Foydalanuvchi";
    const rawImage = userObj?.image ?? userObj?.avatar ?? r.userImage ?? "";
    const avatar = rawImage ? (rawImage.startsWith("http") ? rawImage : `${API_URL}/${rawImage}`) : null;
    return {
        id: r.id,
        author: fullName,
        avatar,
        initials: initialsOf(fullName),
        date: formatDate(r.createdAt ?? r.date ?? ""),
        rating: r.rating ?? 0,
        text: r.comment ?? r.text ?? "",
    };
}

async function fetchReviews(courseId: number): Promise<Comment[]> {
    try {
        const {data} = await axios.get(`${API_URL}/public/courseReviews?size=500`);
        const all: ReviewRaw[] = Array.isArray(data) ? data : (data?.data ?? []);
        const forCourse = all.filter(r => Number(r.courseId) === courseId);

        const idsToFetch = Array.from(new Set(
            forCourse
                .filter(r => typeof r.userId === "number")
                .map(r => r.userId as number)
        ));
        const users = await Promise.all(idsToFetch.map(fetchUserById));
        const userById = new Map(idsToFetch.map((id, i) => [id, users[i]]));

        return forCourse.map(r => mapReview(r, typeof r.userId === "number" ? (userById.get(r.userId) ?? null) : null));
    } catch {
        return [];
    }
}

export default function CourseComments({courseId}: { courseId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeReportId, setActiveReportId] = useState<number | null>(null);
    const [reportTarget, setReportTarget] = useState<number | null>(null);

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        fetchReviews(courseId).then(list => {
            setComments(list);
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
                        <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#2C2F31]">
                            {comment.avatar ? (
                                <img
                                    src={comment.avatar}
                                    alt={comment.author}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-[15px] font-semibold text-[#D0DCE8]">{comment.initials}</span>
                            )}
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
                                        onClick={() => { setReportTarget(comment.id); setActiveReportId(null); }}
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

            {reportTarget !== null && (
                <ReportModal target="courseReview" targetId={reportTarget} onClose={() => setReportTarget(null)}/>
            )}
        </div>
    );
}
