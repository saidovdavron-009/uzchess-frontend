"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {getToken, getUserId} from "@/app/common/components/Auth/authApi";
import {fetchUserLessonProgress, UserLessonRecord} from "@/app/courses/api/userLessonApi";
import {
    fetchCourseSectionsWithLessons,
    formatDuration,
    getThumbnail,
    getVideoUrl,
    parseDurationToSeconds,
    Section,
} from "@/app/courses/utils/lessonHelpers";

type LessonStatus = "locked" | "unlocked" | "in-progress" | "completed";

function getLessonStatus(record: UserLessonRecord | undefined, reachable: boolean): LessonStatus {
    if (record?.isCompleted) return "completed";
    if (!reachable) return "locked";
    if (record && (record.stoppedAt ?? 0) > 0) return "in-progress";
    return "unlocked";
}

export default function CourseAccordion({courseId}: { courseId: number }) {
    const router = useRouter();
    const [sections, setSections] = useState<Section[]>([]);
    const [openSections, setOpenSections] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<Map<number, UserLessonRecord>>(new Map());
    const [videoDurations, setVideoDurations] = useState<Map<number, number>>(new Map());
    const token = getToken();

    useEffect(() => {
        if (!courseId || isNaN(courseId)) return;
        setLoading(true);
        fetchCourseSectionsWithLessons(courseId)
            .then(withLessons => {
                setSections(withLessons);
                if (withLessons.length > 0) setOpenSections([withLessons[0].id]);
            })
            .catch(e => console.error("CourseAccordion fetch error:", e))
            .finally(() => setLoading(false));
    }, [courseId]);

    useEffect(() => {
        if (!token) return;
        const uid = getUserId(token);
        if (!uid) return;
        fetchUserLessonProgress(token, uid).then(setProgress);
    }, [token]);

    const orderedLessons = sections.flatMap(s => s.lessons ?? []);
    const lessonIndexMap = new Map(orderedLessons.map((l, i) => [l.id, i]));

    function toggle(id: number) {
        setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    }

    function openLesson(lessonId: number, reachable: boolean) {
        if (!reachable) return;
        router.push(`/courses/${courseId}/lesson/${lessonId}`);
    }

    if (loading) return (
        <div className="w-full rounded-[12px] border-[0.5px] border-[#2C2F31] bg-[#1A1D1F] flex items-center justify-center py-12">
            <p className="text-[#9DA1A3] font-poppins text-[16px]">Yuklanmoqda...</p>
        </div>
    );

    if (sections.length === 0) return null;

    const firstIncompleteIndex = orderedLessons.findIndex(l => !progress.get(l.id)?.isCompleted);

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
                                            {(section.lessons ?? []).map((lesson, i) => {
                                                const record = progress.get(lesson.id);
                                                const globalIndex = lessonIndexMap.get(lesson.id) ?? 0;
                                                const reachable = firstIncompleteIndex === -1 || globalIndex <= firstIncompleteIndex;
                                                const status = getLessonStatus(record, reachable);
                                                const probedSeconds = videoDurations.get(lesson.id);
                                                const durationSeconds = probedSeconds ?? parseDurationToSeconds(lesson.duration);
                                                const watchedPct = status === "in-progress" && durationSeconds > 0
                                                    ? Math.min(100, ((record?.stoppedAt ?? 0) / durationSeconds) * 100)
                                                    : 0;
                                                const durationLabel = probedSeconds ? formatDuration(probedSeconds) : (lesson.duration ?? "00:00");

                                                return (
                                                    <div
                                                        key={`${section.id}-${lesson.order ?? i}`}
                                                        className={`rounded-[8px] overflow-hidden ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
                                                        onClick={() => openLesson(lesson.id, reachable)}
                                                    >
                                                        <div className="relative h-[180px]">
                                                            <img
                                                                src={getThumbnail(lesson)}
                                                                alt={lesson.title}
                                                                className="w-full h-full object-cover rounded-[8px] border border-[#2C2F31]"
                                                            />
                                                            {probedSeconds === undefined && (
                                                                <video
                                                                    src={getVideoUrl(lesson)}
                                                                    preload="metadata"
                                                                    className="hidden"
                                                                    onLoadedMetadata={e => {
                                                                        const d = e.currentTarget.duration;
                                                                        if (d && isFinite(d)) {
                                                                            setVideoDurations(prev => new Map(prev).set(lesson.id, d));
                                                                        }
                                                                    }}
                                                                />
                                                            )}

                                                            {status === "locked" && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-[8px]">
                                                                    <div
                                                                        className="w-20 h-20 rounded-full flex items-center justify-center"
                                                                        style={{background: "radial-gradient(circle, rgba(224,181,49,0.85) 0%, rgba(224,181,49,0) 70%)"}}
                                                                    >
                                                                        <Image src="/icon-lock.svg" alt="" width={20} height={20}/>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="absolute bottom-[10px] left-[10px] flex items-center gap-1">
                                                                <Image src="/icon-play.svg" alt="" width={15} height={17}/>
                                                                <p className="text-[14px] font-normal text-[#F7F9FA99]">{durationLabel}</p>
                                                            </div>

                                                            {status === "completed" && (
                                                                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#82CC27] rounded-b-[8px]"/>
                                                            )}
                                                            {status === "in-progress" && (
                                                                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F7F9FA26] rounded-b-[8px] overflow-hidden">
                                                                    <div className="h-full bg-[#1C92E0]" style={{width: `${watchedPct}%`}}/>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h3 className={`mt-[20px] text-[20px] font-medium ${status === "locked" ? "text-[#6F767E]" : "text-[#d0dce8]"}`}>
                                                            {lesson.title}
                                                        </h3>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </>
    );
}
