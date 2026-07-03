"use client"
import {useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import Anons from "@/app/common/components/Anons";
import {getToken, getUserId} from "@/app/common/components/Auth/authApi";
import {fetchUserLessonProgress, saveLessonProgress, UserLessonRecord} from "@/app/courses/api/userLessonApi";
import {
    computeLessonStatuses,
    fetchCourseSectionsWithLessons,
    formatDuration,
    formatLessonDate,
    getThumbnail,
    getVideoUrl,
    Lesson,
    Section,
} from "@/app/courses/utils/lessonHelpers";
import VideoPlayer from "@/app/courses/components/VideoPlayer";
import CourseCompletedModal from "@/app/courses/components/CourseCompletedModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LessonWatchPage() {
    const {id, lessonId} = useParams();
    const router = useRouter();
    const courseId = Number(id);
    const currentLessonId = Number(lessonId);

    const [courseTitle, setCourseTitle] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [progress, setProgress] = useState<Map<number, UserLessonRecord>>(new Map());
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [nextPreviewOpen, setNextPreviewOpen] = useState(false);
    const [nextDuration, setNextDuration] = useState(0);
    const [showCourseCompleted, setShowCourseCompleted] = useState(false);
    const progressRef = useRef(progress);
    const token = getToken();

    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    useEffect(() => {
        if (!courseId || isNaN(courseId)) return;
        setLoading(true);
        Promise.all([
            axios.get(`${API_URL}/public/courses/${courseId}`).then(r => r.data).catch(() => null),
            fetchCourseSectionsWithLessons(courseId),
        ]).then(([course, secs]) => {
            setCourseTitle(course?.title ?? "");
            setSections(secs);
            setLoading(false);
        });
    }, [courseId]);

    useEffect(() => {
        if (!token) return;
        const uid = getUserId(token);
        setUserId(uid);
        if (!uid) return;
        fetchUserLessonProgress(token, uid).then(setProgress);
    }, [token]);

    const orderedLessons = sections.flatMap(s => s.lessons ?? []);
    const statuses = computeLessonStatuses(orderedLessons, progress);
    const currentIndex = orderedLessons.findIndex(l => l.id === currentLessonId);
    const currentLesson = orderedLessons[currentIndex];
    const currentInfo = statuses[currentIndex];
    const prevLesson = orderedLessons[currentIndex - 1];
    const nextLesson = orderedLessons[currentIndex + 1];
    const nextInfo = statuses[currentIndex + 1];

    async function handleProgress(seconds: number, completed: boolean) {
        if (!token || !userId || !currentLesson) return;
        const stoppedAt = Math.floor(seconds);
        const existing = progressRef.current.get(currentLesson.id);

        setProgress(prev => {
            const next = new Map(prev);
            next.set(currentLesson.id, {
                id: existing?.id ?? 0,
                userid: userId,
                CourseLessonId: currentLesson.id,
                stoppedAt,
                isCompleted: completed,
            });
            return next;
        });

        const savedId = await saveLessonProgress(token, userId, currentLesson.id, existing?.id ?? null, stoppedAt, completed);
        if (savedId && savedId !== existing?.id) {
            setProgress(prev => {
                const next = new Map(prev);
                const rec = next.get(currentLesson.id);
                if (rec) next.set(currentLesson.id, {...rec, id: savedId});
                return next;
            });
        }

        if (completed && currentIndex === orderedLessons.length - 1) {
            setShowCourseCompleted(true);
        }
    }

    function goToLesson(lesson: Lesson, reachable: boolean) {
        if (!reachable) return;
        router.push(`/courses/${courseId}/lesson/${lesson.id}`);
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

    if (!currentLesson) return (
        <div className="flex flex-col min-h-screen">
            <HeaderItem/>
            <div className="flex-1 flex items-center justify-center">
                <p className="text-red-400 font-poppins text-[18px]">Dars topilmadi.</p>
            </div>
            <Footer/>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderItem/>
            <div className="flex gap-3 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="text-[#6D7274] font-medium mb-1">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="text-[#6D7274] font-medium mb-1">Kurslar</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 ml-[4px] mb-[2px]"/>
                <h4 className="text-white font-medium mb-1">{courseTitle}</h4>
            </div>

            <div className="flex gap-6 mt-[15px] px-[40px] items-start">
                <div className="flex-1 min-w-0">
                    <div className="bg-[#1a1d1f] border border-[#1f272a] rounded-[12px] p-[20px]">
                        <h1 className="text-[24px] font-bold text-[#f7f9fa] mb-[16px]">{courseTitle}</h1>

                        <VideoPlayer
                            videoKey={currentLesson.id}
                            src={getVideoUrl(currentLesson)}
                            initialSeconds={currentInfo?.record?.stoppedAt ?? 0}
                            onProgress={seconds => handleProgress(seconds, false)}
                            onEnded={durationSeconds => handleProgress(durationSeconds, true)}
                            nextLesson={nextLesson && nextInfo?.reachable ? {title: nextLesson.title, content: nextLesson.content, thumbnail: getThumbnail(nextLesson)} : null}
                            onPlayNext={() => nextLesson && goToLesson(nextLesson, nextInfo?.reachable ?? false)}
                            lessonDate={formatLessonDate(currentLesson.date)}
                        />

                        {currentLesson.content && (
                            <p className="text-[#C2C4C5] text-[14px] leading-[22px] mt-[20px]">
                                {currentLesson.content}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-[24px]">
                        <button
                            onClick={() => prevLesson && goToLesson(prevLesson, true)}
                            disabled={!prevLesson}
                            className="flex items-center gap-[8px] px-[20px] h-[44px] rounded-[8px] bg-white/10 text-[#f7f9fa] font-medium disabled:opacity-40 hover:bg-white/[0.15] transition-colors"
                        >
                            <Image src="/icon-chevron-right-sm.svg" alt="" width={16} height={16} className="rotate-180"/>
                            Oldingi
                        </button>
                        <div
                            className="relative"
                            onMouseEnter={() => setNextPreviewOpen(true)}
                            onMouseLeave={() => setNextPreviewOpen(false)}
                        >
                            {nextPreviewOpen && nextLesson && (
                                <div className="absolute bottom-[56px] right-0 w-[243px] h-[101px] bg-[#14171A] border-2 border-[#1F272A] rounded-[12px] p-1 shadow-2xl flex items-center gap-[12px]">
                                    <div className="relative rounded-[8px] overflow-hidden shrink-0 flex items-center justify-center">
                                        <img
                                            src={getThumbnail(nextLesson)}
                                            alt={nextLesson.title}
                                            className="w-[106px] h-[93px] object-cover"
                                        />
                                        {nextDuration === 0 && (
                                            <video
                                                src={getVideoUrl(nextLesson)}
                                                preload="metadata"
                                                className="hidden"
                                                onLoadedMetadata={e => {
                                                    const d = e.currentTarget.duration;
                                                    if (d && isFinite(d)) setNextDuration(d);
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="pr-[12px] max-w-[150px]">
                                        <p className="text-[15px] font-semibold text-[#f7f9fa] leading-snug line-clamp-2">{nextLesson.title}</p>
                                        <p className="text-[13px] text-[#9DA1A3] mt-[4px]">
                                            {nextDuration > 0 ? formatDuration(nextDuration) : (nextLesson.duration ?? "00:00")}
                                        </p>
                                    </div>

                                </div>
                            )}
                            <button
                                onClick={() => nextLesson && goToLesson(nextLesson, nextInfo?.reachable ?? false)}
                                disabled={!nextLesson || !nextInfo?.reachable}
                                className="flex items-center gap-[8px] px-[20px] h-[44px] rounded-[8px] bg-white/10 text-[#f7f9fa] font-medium disabled:opacity-40 hover:bg-white/[0.15] transition-colors"
                            >
                                Keyingi
                                <Image src="/icon-chevron-right-sm.svg" alt="" width={16} height={16}/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-[326px] shrink-0">
                    <div className="w-full rounded-[8px] border border-[#1F272A] bg-[#1A1D1F] max-h-[420px] overflow-y-auto custom-scrollbar">
                        {statuses.map(({lesson, status, reachable}, i) => (
                            <div key={lesson.id}>
                                <div
                                    onClick={() => goToLesson(lesson, reachable)}
                                    className={`flex items-center gap-[8px] px-[24px] py-[13px] transition-colors ${reachable ? "cursor-pointer hover:bg-white/5" : "cursor-not-allowed opacity-50"} ${lesson.id === currentLesson.id ? "bg-white/5" : ""}`}
                                >
                                    <div className={`shrink-0 w-[40px] h-[40px] rounded-[8px] border border-white/[0.08] flex items-center justify-center ${status === "in-progress" || status === "unlocked" ? "bg-[#1c92e0]" : "bg-white/10"}`}>
                                        {status === "completed" ? (
                                            <Image src="/icon-checkmark-circle-green.svg" alt="" width={20} height={20}/>
                                        ) : status === "locked" ? (
                                            <Image src="/icon-lock.svg" alt="" width={20} height={20}/>
                                        ) : (
                                            <Image src="/vdplay.svg" alt="" width={20} height={20} className="ml-[5px]"/>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12px] text-[#1c92e0]">{i + 1}-dars</p>
                                        <p className="text-[14px] text-[#f7f9fa] truncate">{lesson.title}</p>
                                    </div>
                                </div>
                                {i < statuses.length - 1 && <div className="mx-[24px] border-b border-[#1F272A]"/>}
                            </div>
                        ))}
                    </div>
                    <Anons/>
                </div>
            </div>

            <div className="h-[64px]"/>
            <Footer/>

            {showCourseCompleted && (
                <CourseCompletedModal
                    onClose={() => setShowCourseCompleted(false)}
                    onDownloadCertificate={() => setShowCourseCompleted(false)}
                />
            )}
        </div>
    );
}
