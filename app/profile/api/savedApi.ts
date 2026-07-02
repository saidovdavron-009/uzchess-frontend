import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface SavedBook {
    id: number;
    title: string;
    image: string;
    price: number;
    newPrice: number;
    rating?: number;
    author?: { id?: number; fullName: string };
    category?: { id?: number; title: string };
    language?: { id?: number; code: string };
    difficulty?: { id?: number; title: string; icon: string };
    pages?: number;
    description?: string;
}

export interface SavedCourse {
    id: number;
    title: string;
    image: string;
    price: number;
    newPrice: number;
    rating: number;
    reviewsCount?: number;
    lessonsCount?: number;
    author?: { id?: number; fullName: string };
    difficulty?: { id?: number; title: string; icon: string };
    description?: string;
}

export interface SavedSouvenir {
    id: number;
    title: string;
    price: number;
    souvenirImage: { image: string }[];
}

export async function fetchSavedBooks(token: string): Promise<SavedBook[]> {
    if (!token) return [];
    try {
        const [likedRes, allRes] = await Promise.all([
            axios.get(`${API_URL}/public/book-like`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/public/book`),
        ]);
        const liked: { id?: number; bookId?: number }[] = Array.isArray(likedRes.data)
            ? likedRes.data
            : (likedRes.data?.data ?? []);
        const allBooks: SavedBook[] = Array.isArray(allRes.data)
            ? allRes.data
            : (allRes.data?.data ?? []);
        const bookMap = new Map(allBooks.map((b) => [b.id, b]));
        return liked
            .map((item) => bookMap.get(item.bookId ?? item.id ?? 0) ?? null)
            .filter((b): b is SavedBook => b !== null);
    } catch {
        return [];
    }
}

export async function fetchSavedCourses(token: string): Promise<SavedCourse[]> {
    if (!token) return [];
    try {
        const [likedRes, allRes] = await Promise.all([
            axios.get(`${API_URL}/public/course-like`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/public/courses?size=100`),
        ]);
        const liked: { id?: number; courseId?: number }[] = Array.isArray(likedRes.data)
            ? likedRes.data
            : (likedRes.data?.data ?? []);
        const allCourses: SavedCourse[] = Array.isArray(allRes.data)
            ? allRes.data
            : (allRes.data?.data ?? []);
        const courseMap = new Map(allCourses.map((c) => [c.id, c]));
        return liked
            .map((item) => courseMap.get(item.courseId ?? item.id ?? 0) ?? null)
            .filter((c): c is SavedCourse => c !== null);
    } catch {
        return [];
    }
}

export async function fetchSavedSouvenirs(token: string): Promise<SavedSouvenir[]> {
    if (!token) return [];
    try {
        const { data } = await axios.get(`${API_URL}/public/souvenir-likes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const items = Array.isArray(data) ? data : (data.data ?? []);
        return items.filter(Boolean);
    } catch {
        return [];
    }
}

export async function unlikeBook(token: string, bookId: number): Promise<void> {
    await axios.post(`${API_URL}/public/book-like/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function unlikeCourse(token: string, courseId: number): Promise<void> {
    await axios.post(`${API_URL}/public/course-like/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function unlikeSouvenir(token: string, souvenirId: number): Promise<void> {
    await axios.post(`${API_URL}/public/souvenir-likes/${souvenirId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function fixUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
}

export function formatPrice(price: number | string): string {
    const num = Math.round(Number(price));
    return num.toLocaleString("ru-RU").replace(/,/g, " ") + ".00 UZS";
}
