import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function toggleCourseLike(token: string, courseId: number): Promise<void> {
    await axios.post(`${API_URL}/public/course-like/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function toggleBookLike(token: string, bookId: number): Promise<void> {
    await axios.post(`${API_URL}/public/book-like/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function fetchLikedCourseIds(token: string): Promise<Set<number>> {
    if (!token) return new Set();
    try {
        const { data } = await axios.get(`${API_URL}/public/course-like`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const items: { courseId?: number; id?: number }[] = Array.isArray(data) ? data : (data?.data ?? []);
        return new Set(items.map(i => i.courseId ?? i.id ?? 0).filter(Boolean));
    } catch { return new Set(); }
}

export async function fetchLikedBookIds(token: string): Promise<Set<number>> {
    if (!token) return new Set();
    try {
        const { data } = await axios.get(`${API_URL}/public/book-like`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const items: { bookId?: number; id?: number }[] = Array.isArray(data) ? data : (data?.data ?? []);
        return new Set(items.map(i => i.bookId ?? i.id ?? 0).filter(Boolean));
    } catch { return new Set(); }
}
