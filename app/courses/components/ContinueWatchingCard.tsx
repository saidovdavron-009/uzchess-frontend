"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import DonationsBanner from "@/app/common/components/donationsBanner";
import {getToken, getUserId} from "@/app/common/components/Auth/authApi";
import {fetchUserLessonProgress, UserLessonRecord} from "@/app/courses/api/userLessonApi";
import {
    fetchCourseSectionsWithLessons,
    formatDuration,
    getThumbnail,
    getVideoUrl,
    Lesson,
    parseDurationToSeconds,
} from "@/app/courses/utils/lessonHelpers";

export default function ContinueWatchingCard({courseId}: { courseId: number }) {
    const router = useRouter();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [record, setRecord] = useState<UserLessonRecord | null>(null);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const token = getToken();
        if (!courseId || isNaN(courseId) || !token) return;
        const uid = getUserId(token);
        if (!uid) return;

        Promise.all([fetchCourseSectionsWithLessons(courseId), fetchUserLessonProgress(token, uid)])
            .then(([sections, progress]) => {
                const orderedLessons = sections.flatMap(s => s.lessons ?? []);
                const inProgress = orderedLessons.find(l => {
                    const r = progress.get(l.id);
                    return r && !r.isCompleted && (r.stoppedAt ?? 0) > 0;
                });
                if (inProgress) {
                    setLesson(inProgress);
                    setRecord(progress.get(inProgress.id) ?? null);
                    setDuration(parseDurationToSeconds(inProgress.duration));
                }
            })
            .catch(() => {});
    }, [courseId]);

    if (!lesson) return <DonationsBanner/>;

    const watchedPct = duration > 0 ? Math.min(100, ((record?.stoppedAt ?? 0) / duration) * 100) : 0;

    return (
        <div
            className="w-[326px] bg-[#1A1D1F] border-[1px] border-[#232627] rounded-[8px] p-[20px] cursor-pointer"
            onClick={() => router.push(`/courses/${courseId}/lesson/${lesson.id}`)}
        >
            <p className="text-[16px] font-bold text-[#f7f9fa] mb-[16px]">Siz shu videoni ko&apos;ryotgan edingiz</p>
            <div className="relative w-full h-[120px]">
                <img
                    src={getThumbnail(lesson)}
                    alt={lesson.title}
                    className="w-full h-full object-cover rounded-[8px] border border-[#2C2F31]"
                />
                {duration === 0 && (
                    <video
                        src={getVideoUrl(lesson)}
                        preload="metadata"
                        className="hidden"
                        onLoadedMetadata={e => {
                            const d = e.currentTarget.duration;
                            if (d && isFinite(d)) setDuration(d);
                        }}
                    />
                )}
                <div className="absolute bottom-[10px] left-[10px] flex items-center gap-1">
                    <Image src="/icon-play.svg" alt="" width={15} height={17}/>
                    <p className="text-[14px] font-normal text-[#F7F9FA99]">{duration > 0 ? formatDuration(duration) : (lesson.duration ?? "00:00")}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F7F9FA26] rounded-b-[8px] overflow-hidden">
                    <div className="h-full bg-[#1C92E0]" style={{width: `${watchedPct}%`}}/>
                </div>
            </div>
            <h3 className="mt-[16px] text-[16px] font-medium text-[#d0dce8]">{lesson.title}</h3>
        </div>
    );
}
