"use client"
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import axios from "axios";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import YoshlarAgencyPoster from "@/app/common/components/yoshlar-agency-poster";
import {getToken, getUserId} from "@/app/common/components/Auth/authApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const STAR_PATH = "M5.81962 0.143886C5.91914 -0.0479039 6.19349 -0.0479036 6.29301 0.143886L8.01294 3.45839C8.05161 3.53292 8.12313 3.58488 8.20597 3.59863L11.8897 4.21014C12.1029 4.24553 12.1877 4.50645 12.036 4.66036L9.41523 7.32035C9.3563 7.38016 9.32898 7.46424 9.3415 7.54727L9.89826 11.2397C9.93048 11.4534 9.70852 11.6146 9.51528 11.518L6.17561 9.84742C6.10052 9.80985 6.01211 9.80985 5.93702 9.84742L2.59735 11.518C2.40411 11.6146 2.18215 11.4534 2.21437 11.2397L2.77113 7.54727C2.78365 7.46424 2.75633 7.38016 2.6974 7.32035L0.0766115 4.66036C-0.0750376 4.50645 0.00974137 4.24553 0.222898 4.21014L3.90666 3.59863C3.9895 3.58488 4.06102 3.53292 4.09969 3.45839L5.81962 0.143886Z";

export default function CourseCompletionPage() {
    const {id} = useParams();
    const courseId = Number(id);
    const [courseTitle, setCourseTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!courseId || isNaN(courseId)) return;
        axios.get(`${API_URL}/public/courses/${courseId}`)
            .then(r => setCourseTitle(r.data?.title ?? ""))
            .catch(() => setCourseTitle(""));
    }, [courseId]);

    async function submitReview() {
        const token = getToken();
        const userId = token ? getUserId(token) : null;
        if (!userId || !rating || submitting) return;
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/admin/courseReviews`, {
                userId,
                courseId,
                rating,
                comment,
                date: new Date().toISOString(),
            }, {headers: {Authorization: `Bearer ${token}`}});
            setSubmitted(true);
            setComment("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderItem/>
            <div className="flex gap-3 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="text-[#6D7274] font-medium">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[5px]"/>
                <h4 className="text-[#6D7274] font-medium">O'rganish</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 ml-[4px] mb-[5px]"/>
                <h4 className="text-white font-medium">{courseTitle}</h4>
            </div>

            <div className="flex gap-6 mt-[15px] px-[40px] items-start">
                <section className="flex-1 min-w-0 flex flex-col gap-6">
                    <div className="relative w-full rounded-[12px] bg-[#0B1418] border border-[#1F272A] pt-[80px] pb-[32px] px-[32px] flex flex-col items-center text-center overflow-hidden">
                        <Image
                            src="/certificate-bg-glow.png"
                            alt=""
                            width={1026}
                            height={404}
                            className="absolute top-0 left-0 w-full h-[404px] object-cover pointer-events-none select-none"
                        />
                        <div className="relative w-full max-w-[568px] aspect-[568/400]">
                            <Image src="/certificate-template.png" alt="Sertifikat" fill className="object-contain"/>
                        </div>
                        <h3 className="relative mt-[15px] text-[24px] font-bold text-[#f7f9fa] font-poppins max-w-[760px]">
                            Tabriklaymiz, videodarsliklarni muvaffaqiyatli tamomladingiz
                        </h3>
                        <p className="relative mt-[8px] text-[16px] font-medium text-[#9DA1A3] font-poppins">
                            Sertifikatni olish uchun pastdagi tugmani bosing.
                        </p>
                        <a
                            href="/certificate-template.png"
                            download="sertifikat.png"
                            className="relative mt-[36px] w-[200px] h-[44px] rounded-[8px] bg-[#1c92e0] hover:bg-[#1a7fc7] transition-colors flex items-center justify-center gap-[10px] text-[#f7f9fa] text-[16px] font-medium font-poppins"
                        >
                            <Image src="/icon-cloud-download.svg" alt="" width={20} height={20}/>
                            Yuklab olish
                        </a>
                    </div>

                    <div className="w-full rounded-[12px] bg-[#1A1D1F] border border-[#1F272A] p-[32px]">
                        <h2 className="text-[28px] font-bold text-[#f7f9fa] font-poppins">Kursga baho bering</h2>

                        <div className="flex gap-[20px] mt-[28px]">
                            {[1, 2, 3, 4, 5].map(star => {
                                const active = star <= (hoverRating || rating);
                                return (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className={`w-[62px] h-[62px] rounded-[9px] flex items-center justify-center transition-colors ${active ? "bg-[#FDCE36]/10" : "bg-[#C7C7C7]/10"}`}
                                    >
                                        <svg width="37" height="34" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d={STAR_PATH} fill={active ? "#E0B531" : "#13181C"}/>
                                        </svg>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="text-[15px] font-medium text-[#9DA1A3] mt-[24px] font-poppins">Izoh</p>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Izoh qoldiring"
                            className="w-full h-[120px] mt-[8px] rounded-[8px] bg-[#13181C] border border-[#454F54] p-[16px] text-[#f7f9fa] text-[14px] font-poppins placeholder:text-[#9DA1A3] resize-none focus:outline-none"
                        />

                        <div className="flex justify-end mt-[24px]">
                            <button
                                onClick={submitReview}
                                disabled={!rating || submitting}
                                className="w-[140px] h-[40px] rounded-[8px] bg-[#1c92e0] hover:bg-[#1a7fc7] disabled:opacity-40 transition-colors flex items-center justify-center text-[#f7f9fa] text-[16px] font-medium font-poppins"
                            >
                                {submitted ? "Yuborildi" : "Yuborish"}
                            </button>
                        </div>
                    </div>
                </section>

                <YoshlarAgencyPoster/>
            </div>

            <div className="h-[64px]"/>
            <Footer/>
        </div>
    );
}
