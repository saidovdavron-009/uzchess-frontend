import axios from "axios";
import {UserLessonRecord} from "@/app/courses/api/userLessonApi";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

export interface Lesson {
    id: number;
    title: string;
    content?: string;
    date?: string;
    duration?: string;
    video?: string;
    thumbnail?: string;
    order?: number;
    courseSectionId?: number;
    courseId?: number;
    isFree?: boolean;
}

export interface Section {
    id: number;
    title: string;
    order?: number;
    courseId?: number;
    lessons?: Lesson[];
}

export function getThumbnail(lesson: Lesson): string {
    const raw = lesson.thumbnail ?? "";
    if (!raw) return "/BookImage/image4.svg";
    if (raw.startsWith("http")) return raw;
    return `${API_URL}/${raw}`;
}

export function getVideoUrl(lesson: Lesson): string {
    const raw = lesson.video ?? "";
    if (!raw) return PLACEHOLDER_VIDEO;
    if (raw.startsWith("http")) return raw;
    return `${API_URL}/${raw}`;
}

export function parseDurationToSeconds(duration?: string): number {
    if (!duration) return 0;
    const parts = duration.split(":").map(Number);
    if (parts.some(n => isNaN(n))) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
}

const UZ_MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

export function formatLessonDate(dateStr?: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const month = UZ_MONTHS[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${month} ${d.getDate()}, ${d.getFullYear()} • ${hours}:${mins}`;
}

export function formatDuration(seconds: number): string {
    const total = Math.round(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export type LessonStatus = "locked" | "unlocked" | "in-progress" | "completed";

export interface LessonProgressInfo {
    lesson: Lesson;
    status: LessonStatus;
    reachable: boolean;
    accessAllowed: boolean;
    record: UserLessonRecord | undefined;
}

export function computeLessonStatuses(
    orderedLessons: Lesson[],
    progress: Map<number, UserLessonRecord>,
    purchased: boolean,
): LessonProgressInfo[] {
    let previousCompleted = true;
    return orderedLessons.map((lesson) => {
        const record = progress.get(lesson.id);
        const accessAllowed = purchased || lesson.isFree === true;
        const reachable = accessAllowed && previousCompleted;
        if (accessAllowed) previousCompleted = record?.isCompleted === true;
        let status: LessonStatus;
        if (record?.isCompleted) status = "completed";
        else if (!reachable) status = "locked";
        else if (record && (record.stoppedAt ?? 0) > 0) status = "in-progress";
        else status = "unlocked";
        return {lesson, status, reachable, accessAllowed, record};
    });
}

function getUserIdFromToken(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        return decoded.id ?? null;
    } catch {
        return null;
    }
}

export async function checkCoursePurchased(courseId: number, token: string): Promise<boolean> {
    try {
        const userId = getUserIdFromToken(token);
        if (!userId) return false;
        const {data} = await axios.get(`${API_URL}/public/purchasedCourse?size=200`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        const list: {id: number; userId: number | {id: number}}[] =
            Array.isArray(data) ? data : (data.data ?? []);
        const mine = list.filter(item => {
            const uid = typeof item.userId === "object" ? item.userId?.id : item.userId;
            return Number(uid) === userId;
        });
        for (const item of mine) {
            const {data: detail} = await axios.get(`${API_URL}/public/purchasedCourse/${item.id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (Number(detail.courseId) === courseId) return true;
        }
        return false;
    } catch {
        return false;
    }
}

export async function fetchCourseSectionsWithLessons(courseId: number): Promise<Section[]> {
    const [secRes, lesRes] = await Promise.all([
        axios.get(`${API_URL}/public/courseSection?size=500`),
        axios.get(`${API_URL}/public/courseLesson?size=500`),
    ]);

    const allSections: Section[] = Array.isArray(secRes.data) ? secRes.data : (secRes.data?.data ?? []);
    const allLessons: Lesson[] = Array.isArray(lesRes.data) ? lesRes.data : (lesRes.data?.data ?? []);

    return allSections
        .filter(s => Number(s.courseId) === courseId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(section => ({
            ...section,
            lessons: allLessons
                .filter(l => Number(l.courseSectionId) === section.id)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
}
