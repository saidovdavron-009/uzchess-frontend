import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface UserLessonRecord {
    id: number;
    userid: number;
    CourseLessonId: number;
    stoppedAt: number | null;
    isCompleted: boolean;
}

export async function fetchUserLessonProgress(token: string, userId: number): Promise<Map<number, UserLessonRecord>> {
    const map = new Map<number, UserLessonRecord>();
    try {
        const {data} = await axios.get(`${API_URL}/public/userLesson`, {
            params: {userid: userId, size: 500},
            headers: {Authorization: `Bearer ${token}`},
        });
        const list: UserLessonRecord[] = Array.isArray(data) ? data : (data.data ?? []);
        list.forEach(r => map.set(Number(r.CourseLessonId), r));
    } catch {}
    return map;
}

export async function saveLessonProgress(
    token: string,
    userId: number,
    lessonId: number,
    existingId: number | null,
    stoppedAt: number,
    isCompleted: boolean,
): Promise<number | null> {
    try {
        if (existingId) {
            await axios.patch(`${API_URL}/admin/userLesson/${existingId}`, {stoppedAt, isCompleted}, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return existingId;
        }
        const {data} = await axios.post(`${API_URL}/admin/userLesson`, {
            userid: userId, CourseLessonId: lessonId, stoppedAt, isCompleted,
        }, {headers: {Authorization: `Bearer ${token}`}});
        return data?.id ?? null;
    } catch {
        return existingId;
    }
}
