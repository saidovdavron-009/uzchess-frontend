"use client";
import {useState} from "react";

interface Comment {
    id: number;
    author: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
}

const commentsData: Comment[] = [
    {
        id: 1,
        author: "Jasurbek Narzullayev",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        date: "7 Sentyabr 2022 y. 19:52",
        rating: 4,
        text: "2016 yilda Nyu-Yorkda Karjakin va Karlsen shaxmat toji uchun o'yinda uchrashishdi. Keyin Norvegiya chempioni tay-brekda g'alaba qozondi va chempionlik unvonini saqlab qoldi. 26 noyabr kuni Karlsen va Karuana 12-o'yinni o'tkazishadi. Oq qismlarni amerikalik boshqaradi."
    },
    {
        id: 2,
        author: "Muhammadamin Domlahonov",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
        date: "7 Sentyabr 2022 y. 19:52",
        rating: 3,
        text: "2016 yilda Nyu-Yorkda Karjakin va Karlsen shaxmat toji uchun o'yinda uchrashishdi. Keyin Norvegiya chempioni tay-brekda g'alaba qozondi va chempionlik unvonini saqlab qoldi. 26 noyabr kuni Karlsen va Karuana 12-o'yinni o'tkazishadi. Oq qismlarni amerikalik boshqaradi."
    },
    {
        id: 3,
        author: "Shoxruh Baxtiyorov",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
        date: "7 Sentyabr 2022 y. 19:52",
        rating: 5,
        text: "2016 yilda Nyu-Yorkda Karjakin va Karlsen shaxmat toji uchun o'yinda uchrashishdi. Keyin Norvegiya chempioni tay-brekda g'alaba qozondi va chempionlik unvonini saqlab qoldi. 26 noyabr kuni Karlsen va Karuana 12-o'yinni o'tkazishadi. Oq qismlarni amerikalik boshqaradi."
    },
    {
        id: 4,
        author: "Jasurbek Narzullayev",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        date: "7 Sentyabr 2022 y. 19:52",
        rating: 4,
        text: "2016 yilda Nyu-Yorkda Karjakin va Karlsen shaxmat toji uchun o'yinda uchrashishdi. Keyin Norvegiya chempioni tay-brekda g'alaba qozondi va chempionlik unvonini saqlab qoldi. 26 noyabr kuni Karlsen va Karuana 12-o'yinni o'tkazishadi. Oq qismlarni amerikalik boshqaradi."
    }
];

export default function CourseComments() {
    const [activeReportId, setActiveReportId] = useState<number | null>(null);

    return (
        <div className="w-full font-sans text-white">
            <h2 className="text-[28px] font-bold mb-[13px]">Kurs haqida izohlar</h2>

            <div className="flex flex-col gap-6 bg-[#1A1D1F] p-[20px] border border-[#1F272A] rounded-[12px]">
                {commentsData.map((comment) => (
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
                        <span className="text-[12px] text-[#9DA1A3]">
                            {comment.date}
                        </span>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill={index < comment.rating ? "#F59E0B" : "none"}
                                            stroke={index < comment.rating ? "#F59E0B" : "#4A4D50"}
                                            strokeWidth="2"
                                        >
                                            <polygon
                                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                        </svg>
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2.5">
                                    <circle cx="12" cy="5" r="1"/>
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="12" cy="19" r="1"/>
                                </svg>
                            </button>

                            {activeReportId === comment.id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveReportId(null)}/>

                                    <div
                                        className="absolute right-0 mt-2 z-20 bg-[#1A1D1F] border border-[#2C2F31] rounded-[6px] shadow-2xl p-[10px] w-[140px] flex items-center gap-2 cursor-pointer hover:bg-white/[0.03] transition-colors select-none">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                                            <path
                                                d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 3v4h2V9h-2zm0 6v2h2v-2h-2z"/>
                                        </svg>
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