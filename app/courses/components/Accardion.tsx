"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

interface Lesson {
    id: number;
    title: string;
    duration?: string;
    video?: string;
    thumbnail?: string;
    order?: number;
    courseSectionId?: number;
    courseId?: number;
    isFree?: boolean;
}

interface Section {
    id: number;
    title: string;
    order?: number;
    courseId?: number;
    lessons?: Lesson[];
}

function VideoModal({url, title, onClose}: { url: string; title: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]" onClick={onClose}>
            <div className="relative w-[800px]" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white text-[24px] font-bold hover:opacity-70 cursor-pointer">✕</button>
                <video src={url} controls autoPlay className="w-full rounded-[12px] bg-black"/>
                <p className="text-white text-[14px] mt-2 text-center font-poppins">{title}</p>
            </div>
        </div>
    );
}

function getThumbnail(lesson: Lesson): string {
    const raw = lesson.thumbnail ?? "";
    if (!raw) return "/BookImage/image4.svg";
    if (raw.startsWith("http")) return raw;
    return `${API_URL}/${raw}`;
}

function getVideoUrl(lesson: Lesson): string {
    const raw = lesson.video ?? "";
    if (!raw) return PLACEHOLDER_VIDEO;
    if (raw.startsWith("http")) return raw;
    return `${API_URL}/${raw}`;
}

export default function CourseAccordion({courseId}: { courseId: number }) {
    const [sections, setSections] = useState<Section[]>([]);
    const [openSections, setOpenSections] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [videoModal, setVideoModal] = useState<{ url: string; title: string } | null>(null);

    useEffect(() => {
        if (!courseId || isNaN(courseId)) return;
        setLoading(true);
        (async () => {
            try {
                const [secRes, lesRes] = await Promise.all([
                    axios.get(`${API_URL}/public/courseSection?size=500`),
                    axios.get(`${API_URL}/public/courseLesson?size=500`),
                ]);

                const allSections: Section[] = Array.isArray(secRes.data) ? secRes.data : (secRes.data?.data ?? []);
                const allLessons: Lesson[] = Array.isArray(lesRes.data) ? lesRes.data : (lesRes.data?.data ?? []);

                const courseSections = allSections
                    .filter(s => Number(s.courseId) === courseId)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                const withLessons = courseSections.map(section => ({
                    ...section,
                    lessons: allLessons
                        .filter(l => Number(l.courseSectionId) === section.id)
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
                }));

                setSections(withLessons);
                if (withLessons.length > 0) setOpenSections([withLessons[0].id]);
            } catch(e) {
                console.error("CourseAccordion fetch error:", e);
            }
            setLoading(false);
        })();
    }, [courseId]);

    function toggle(id: number) {
        setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    }

    if (loading) return (
        <div className="w-full rounded-[12px] border-[0.5px] border-[#2C2F31] bg-[#1A1D1F] flex items-center justify-center py-12">
            <p className="text-[#9DA1A3] font-poppins text-[16px]">Yuklanmoqda...</p>
        </div>
    );

    if (sections.length === 0) return null;

    return (
        <>
            <div className="w-full rounded-[12px] border-[0.5px] border-[#2C2F31] overflow-hidden bg-[#1A1D1F]">
                {sections.map((section) => {
                    const isOpen = openSections.includes(section.id);
                    return (
                        <div key={section.id}>
                            <div
                                onClick={() => toggle(section.id)}
                                className="flex justify-between items-center px-6 py-[18px] bg-[#1A1D1F] cursor-pointer border-b-[0.5px] border-[#2C2F31] select-none"
                            >
                                <span className="text-[#f0f4f8] text-[24px] font-bold">{section.title}</span>
                                <Image
                                    src="/icon-chevron-down.svg"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </div>

                            {isOpen && (
                                <div className="bg-[#F7F9FA08] px-6 py-5 border-b-[0.5px] border-[#2C2F31]">
                                    {(section.lessons ?? []).length === 0 ? (
                                        <p className="text-[#9DA1A3] font-poppins text-[14px]">Darslar mavjud emas</p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-4">
                                            {(section.lessons ?? []).map((lesson, i) => (
                                                <div
                                                    key={`${section.id}-${lesson.order ?? i}`}
                                                    className="rounded-[8px] overflow-hidden cursor-pointer"
                                                    onClick={() => setVideoModal({url: getVideoUrl(lesson), title: lesson.title})}
                                                >
                                                    <div className="relative h-[180px]">
                                                        <img
                                                            src={getThumbnail(lesson)}
                                                            alt={lesson.title}
                                                            className="w-full h-full object-cover rounded-[8px] border border-[#2C2F31]"
                                                        />
                                                        <div className="absolute bottom-[10px] left-[10px] flex items-center gap-1">
                                                            <Image src="/icon-play.svg" alt="" width={15} height={17}/>
                                                            <p className="text-[14px] font-normal text-[#F7F9FA99]">{lesson.duration ?? "00:00"}</p>
                                                        </div>
                                                    </div>
                                                    <h3 className="mt-[20px] text-[20px] font-medium text-[#d0dce8]">
                                                        {lesson.title}
                                                    </h3>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {videoModal && (
                <VideoModal url={videoModal.url} title={videoModal.title} onClose={() => setVideoModal(null)}/>
            )}
        </>
    );
}
