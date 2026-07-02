import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CourseListItem {
    id: number;
    title: string;
    image: string;
    lessonsCount: number;
    sectionsCount: number;
    rating: number;
    price: number;
    newPrice: number;
    reviewsCount: number;
    isLike: boolean;
    author: { id: number; fullName: string };
    difficulty: { id: number; title: string; icon: string };
    language: { id: number; title: string; code: string };
    category: { id: number; title: string };
}

export interface PurchasedCourseWithDetail {
    purchaseId: number;
    isCompleted: boolean;
    course: CourseListItem;
}

async function fetchAllCourses(token: string): Promise<CourseListItem[]> {
    const { data } = await axios.get(`${API_URL}/public/courses?size=100`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : (data.data ?? []);
}

async function fetchPurchasedList(token: string): Promise<{ id: number; userId: number; isCompleted: boolean }[]> {
    const { data } = await axios.get(`${API_URL}/public/purchasedCourse`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : (data.data ?? []);
}

async function fetchPurchasedDetail(id: number, token: string): Promise<{ id: number; courseId: number; isCompleted: boolean }> {
    const { data } = await axios.get(`${API_URL}/public/purchasedCourse/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

export async function fetchMyPurchasedCourses(
    userId: number,
    token: string
): Promise<PurchasedCourseWithDetail[]> {
    const [list, allCourses] = await Promise.all([
        fetchPurchasedList(token),
        fetchAllCourses(token),
    ]);

    const mine = userId === 0
        ? list
        : list.filter((item) => Number(item.userId) === Number(userId));

    const courseMap = new Map(allCourses.map((c) => [c.id, c]));

    const results = await Promise.all(
        mine.map(async (item) => {
            const detail = await fetchPurchasedDetail(item.id, token);
            const course = courseMap.get(detail.courseId);
            if (!course) return null;
            return {
                purchaseId: item.id,
                isCompleted: item.isCompleted,
                course,
            };
        })
    );

    return results.filter((r): r is PurchasedCourseWithDetail => r !== null);
}